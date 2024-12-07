import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const data = {
        labels: ['Blue', 'Green', 'Red', 'Yellow'],
        datasets: [
            {
                data: [28, 35, 26, 11],
                backgroundColor: ['#567ed5', '#4CAF50', '#E57373', '#FFEB3B'],
                hoverBackgroundColor: ['#567ed5', '#4CAF50', '#E57373', '#FFEB3B'],
                hoverBorderWidth: 0,
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw}%`,
                },
            },
        },
        responsive: true,
        cutout: '70%', // Adjust to make it look like a ring
        onHover: (event, elements) => {
            if (elements.length) {
                // Get the index of the hovered segment
                const index = elements[0].index;
                // Change opacity of non-hovered segments
                data.datasets[0].backgroundColor = data.datasets[0].backgroundColor.map((color, i) =>
                    i === index ? color : 'rgba(0, 0, 0, 0.1)'
                );
            } else {
                // Reset opacity if no segment is hovered
                data.datasets[0].backgroundColor = ['#567ed5', '#4CAF50', '#E57373', '#FFEB3B'];
            }
        },
    };

    return (
        <div style={{ width: '50%', margin: '0 auto' }}>
            <h2>Total Sales</h2>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default PieChart;
