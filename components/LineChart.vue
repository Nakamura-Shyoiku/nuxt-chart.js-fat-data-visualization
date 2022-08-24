<template>
    <div class="lineChart-container">
        <p>Please select the Data File(extension: .txt).</p>
        <input type="file" ref="doc" @change="readFile()" />
        <canvas id="line_chart"></canvas>
        <canvas id="line_chart1"></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin);
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
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Fatness Line Chart",
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: "xy",
                    threshold: 5,
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: "xy",
                },
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
        };
    },
    methods: {
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
                    console.log(this.content);
                    this.lineChartData = {
                        ...this.lineChartData,
                        data: this.content,
                    };
                    console.log(this.lineChartData);
                    const ctx = document
                        .getElementById("line_chart")
                        .getContext("2d");
                    this.Chart.destroy();
                    new Chart(ctx, this.lineChartData);
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
        Chart.register(zoomPlugin);
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
