<template>
    <div class="lineChart-container">
        <p>Please select the Data File(extension: .txt).</p>
        <input type="file" ref="doc" @change="readFile()" />
        <select @change="changeEntries($event)">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
        </select>
        <canvas id="line_chart" @wheel.prevent="onWheel($event)"></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from "chart.js";

const labels = [];

const data = {
    labels: labels,
    datasets: [
        {
            label: "Weight",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: [],
        },
    ],
};

const lineChartData = {
    type: "line",
    data: data,
    options: {
        responsive: true,
        scales: {
            y: {
                min: 0,
                max: 100,
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Fatness Line Chart",
            },
        },
    },
};

export default {
    name: "LineChart",
    data() {
        return {
            lineChartData: lineChartData,
            file: null,
            content: {
                labels: null,
                datasets: null,
            },
            Chart: null,
            index: 0,
            entries: 10,
        };
    },
    methods: {
        changeEntries(e) {
            this.entries = +e.target.value;
            this.Chart.options = {
                ...this.lineChartData,
                scales: {
                    x: {
                        min: this.content.labels[this.index],
                        max: this.content.labels[this.index + this.entries],
                    },
                },
            };
            this.Chart.update();
        },
        onWheel(e) {
            console.log(e.deltaY > 0);
            let min,
                max = 0;
            if (e.deltaY > 0) {
                if (this.content.labels.length > this.index + this.entries)
                    this.index++;
            } else {
                if (this.index > 0) this.index--;
            }
            this.Chart.options = {
                ...this.lineChartData,
                scales: {
                    x: {
                        min: this.content.labels[this.index],
                        max: this.content.labels[this.index + this.entries],
                    },
                },
            };
            this.Chart.update();
        },
        readFile() {
            this.file = this.$refs.doc.files[0];
            const reader = new FileReader();
            if (this.file && this.file.name.includes(".txt")) {
                reader.onload = (res) => {
                    const data = JSON.parse(res.target.result);
                    this.content.labels = data.map(
                        (value, index) => value.DateTime
                    );
                    this.content.datasets = [
                        {
                            label: "Weight",
                            backgroundColor: "rgb(255, 99, 132)",
                            borderColor: "rgb(255, 99, 132)",
                            data: data.map((value, index) => value.Weight),
                        },
                    ];
                    this.lineChartData = {
                        ...this.lineChartData,
                        data: this.content,
                        options: {
                            ...this.lineChartData,
                            scales: {
                                x: {
                                    min: this.content.labels[this.index],
                                    max: this.content.labels[
                                        this.index + this.entries
                                    ],
                                },
                            },
                        },
                    };
                    console.log(this.lineChartData);
                    const ctx = document
                        .getElementById("line_chart")
                        .getContext("2d");
                    this.Chart.destroy();
                    this.Chart = new Chart(ctx, this.lineChartData);
                };
                reader.onerror = (err) => console.log(err);
                reader.readAsText(this.file);
            } else {
                this.content = null;
                reader.onload = (res) => {
                    console.log(res.target.result);
                };
                reader.onerror = (err) => console.log(err);
                reader.readAsText(this.file);
            }
        },
    },
    mounted() {
        const ctx = document.getElementById("line_chart").getContext("2d");
        Chart.register(...registerables);
        this.Chart = new Chart(ctx, this.lineChartData);
    },
};
</script>

<style scoped>
.lineChart-container > input {
    margin: 0px auto 20px auto;
}
</style>
