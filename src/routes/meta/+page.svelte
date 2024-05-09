<script>
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import Pie from "$lib/Pie.svelte";

    let data = [];
    let commits = [];
    let width = 1000;
    let height = 600;

    onMount(async () => {
        data = await d3.csv("loc.csv", row => ({
            ...row,
            line: Number(row.line), // or just +row.line
            depth: Number(row.depth),
            length: Number(row.length),
            date: new Date(row.date + "T00:00" + row.timezone),
            datetime: new Date(row.datetime)
        }));        commits = d3
            .groups(data, (d) => d.commit)
            .map(([commit, lines]) => {
                let first = lines[0];
                let { author, date, time, timezone, datetime } = first;
                datetime = new Date(datetime);
                let aveDepth = d3.mean(data, (d) => d.depth);
                let maxLineLength = lines.reduce((max, line) => {
                    let lineLength = parseInt(line.length, 10); // Convert the line length to an integer
                    return Math.max(max, lineLength);
                }, 0);
                let ret = {
                    id: commit,
                    url:
                        "https://github.com/vis-society/lab-7/commit/" + commit,
                    author,
                    date,
                    time,
                    timezone,
                    datetime,
                    hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                    totalLines: lines.length,
                    commitsCount: commits.length,
                    longestLine: maxLineLength,
                    aveDepth: aveDepth,
                };

                // Like ret.lines = lines
                // but non-enumerable so it doesn’t show up in JSON.stringify
                Object.defineProperty(ret, "lines", {
                    value: lines,
                    configurable: true,
                    writable: true,
                    enumerable: false,
                });

                return ret;
            });
    });

    let margin = { top: 10, right: 10, bottom: 30, left: 20 };

    let usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;
    $: xScale = d3
        .scaleTime()
        .domain(d3.extent(commits, (commit) => commit.datetime))
        .range([usableArea.left, usableArea.right]);

    $: yScale = d3
        .scaleLinear()
        .domain([0, 24])
        .range([usableArea.bottom, usableArea.top]);

    let xAxis, yAxis;

    $: {
        d3.select(xAxis).call(d3.axisBottom(xScale));
        d3.select(yAxis).call(
            d3
                .axisLeft(yScale)
                .tickFormat((d) => String(d % 24).padStart(2, "0") + ":00"),
        );
    }

    let yAxisGridlines;

    $: {
        d3.select(yAxisGridlines).call(
            d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width),
        );
    }

    let hoveredIndex = -1;
    $: hoveredCommit = commits[hoveredIndex] ?? {};

    let cursor = { x: 0, y: 0 };

    let svg;
    $: {
        d3.select(svg).call(d3.brush().on("start brush end", brushed));
        d3.select(svg).selectAll(".dots, .overlay ~ *").raise();
    }

    let brushSelection;
    function brushed(evt) {
        brushSelection = evt.selection;
    }

    function isCommitSelected(commit) {
        if (!brushSelection) {
            return false;
        }
        let min = { x: brushSelection[0][0], y: brushSelection[0][1] };
        let max = { x: brushSelection[1][0], y: brushSelection[1][1] };
        let x = xScale(commit.date);
        let y = yScale(commit.hourFrac);
        return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
    }

    $: selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
    $: hasSelection = brushSelection && selectedCommits.length > 0; 

    $: selectedLines = (hasSelection ? selectedCommits : commits).flatMap(d => d.lines);
    $: languageBreakdown = d3.rollups(selectedLines, v=>v.length, d => d.type );
    
    let langLines;
    $: langLines = Array.from(languageBreakdown).map(([language, lines]) => ({label: language, value: lines}));

    </script>

<svelte:head>
    <title>Meta</title>
</svelte:head>
<h1 style="width:85%; font-size: 8vh;">Meta</h1>
<h3>Summary</h3>
<dl class="stats">
    <div class="stat-block">
        <dt>Most Lines</dt>
        <dd>{d3.max(commits, (commit) => commit.totalLines)}</dd>
    </div>
    <div class="stat-block">
        <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
        <dd>{data.length}</dd>
    </div>
    <div class="stat-block">
        <dt>Commits</dt>
        <dd>{commits.length}</dd>
    </div>
    <div class="stat-block">
        <dt>Longest Line</dt>
        <dd>{d3.max(commits, (commit) => commit.longestLine)}</dd>
    </div>
</dl>
<h4>Commits by Time of Day</h4>
<div class="svg-viewbox">
    <svg viewBox="0 0 {width} {height}" bind:this={svg}>
        <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
        <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
        <g
            class="gridlines"
            transform="translate({usableArea.left}, 0)"
            bind:this={yAxisGridlines}
        />
        <g class="dots">
            {#each commits as commit, index}
                <circle
                    on:mouseenter={(evt) => {
                        hoveredIndex = index;
                        cursor = { x: evt.x, y: evt.y };
                    }}
                    on:mouseleave={(evt) => (hoveredIndex = -1)}
                    cx={xScale(commit.datetime)}
                    cy={yScale(commit.hourFrac)}
                    r="5"
                    fill="steelblue"

                    class:selected={isCommitSelected(commit)}
                />
            {/each}
        </g>
    </svg>
    <dl
        id="commit-tooltip"
        class="info tooltip"
        hidden={hoveredIndex === -1}
        style="top: {cursor.y}px; left: {cursor.x}px"
    >
        <dt>Commit</dt>
        <dd>
            <a href={hoveredCommit.url} target="_blank">{hoveredCommit.id}</a>
        </dd>

        <dt>Date</dt>
        <dd>
            {hoveredCommit.datetime?.toLocaleString("en", {
                dateStyle: "full",
            })}
        </dd>
        <dt>Time</dt>
        <dd>
            {hoveredCommit.time?.toLocaleString("en", {
                dateStyle: "full",
            })}
        </dd>
        <dt>Author</dt>
        <dd>
            {hoveredCommit.author?.toLocaleString("en", {
                dateStyle: "full",
            })}
        </dd>
        <dt>Lines Edited</dt>
        <dd>
            {hoveredCommit.totalLines?.toLocaleString("en", {
                dateStyle: "full",
            })}
        </dd>

        <!-- Add: Time, author, lines edited -->
    </dl>
    <p>{hasSelection ? selectedCommits.length : "No"} commits selected</p>

    {#each languageBreakdown as [language, lines]}
        <p>{language}:{d3.format(".1~%")(lines / selectedLines.length)}</p>
    {/each}

    <Pie data={Array.from(languageBreakdown).map(([language, lines]) => ({label: language, value: lines}))}/>
</div>

<style>
    .stats {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .stat-block {
        display: flex;
        flex-direction: column;
        width: 20%;
    }
    svg {
        overflow: visible;
    }
    .gridlines {
        stroke-opacity: 0.2;
        d1.info {
            display: flex;
            flex-direction: column;
        }
    }

    .tooltip {
        position: fixed;
        top: 1em;
        left: 3em;
        background-color: rgb(117, 112, 150);
        box-shadow: 50%;
        border-radius: 5px;
        padding: 5px;
    }

    .svg-viewbox:hover .tooltip {
        display: block;
    }

    circle {
        transition: transform 200ms;
        transform-origin: center; /* Ensure the scaling is from the center */
        transform-box: fill-box; /* Use the fill-box to align the transform */
    }

    circle:hover {
        transform: scale(1.5); /* Increase the size of the circle on hover */
    }

    dl.info {
        transition-duration: 500ms;
        transition-property: opacity, visibility;

        &[hidden]:not(:hover, :focus-within) {
            opacity: 0;
            visibility: hidden;
        }
    }
    
</style>
