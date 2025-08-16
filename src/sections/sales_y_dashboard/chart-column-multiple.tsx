import { each } from 'lodash';
import Chart, { useChart } from 'src/components/chart';
import React from 'react';

// ----------------------------------------------------------------------

type Props = {
  series: {
    name: string;
    data: number[];
    labels: string[];
  }[];
};

export default function ChartColumnMultiple({ series }: Props) {
  let barAxis: XAxisAnnotations[] = [];

  let differencesArr: number[] = [];

  function getDifferences(series: any) {
    for (var i = 0; i < series[0].data.length; i++) {
      let difference = 0;
      if (series[1].data[i] == 0) {
        //Nested Tri operators is ugly, leave it as is
        series[0].data[i] == 0
          ? (differencesArr = differencesArr.concat(0))
          : (differencesArr = differencesArr.concat(100));
        continue;
      }
      difference = Math.round(((series[0].data[i] - series[1].data[i]) / series[1].data[i]) * 100);
      differencesArr = differencesArr.concat(difference);
    }
  }
  function fillAnnotation(series: any) {
    var borderColor = '#e6eff1';

    getDifferences(series);
    var textColor = '#00E396';
    for (var i = 0; i < series[0].data.length; i++) {
      differencesArr[i] > 0 ? (textColor = '#00a76f') : (textColor = '#dc3545');

      barAxis = barAxis.concat([
        {
          x: series[0].labels[i],
          borderColor: '#d0d8d9',
          borderWidth: 0.82,
          strokeDashArray: 5,
          label: {
            borderColor: '#84b5c3',
            borderRadius: 7,
            borderWidth: 0,
            orientation: 'horizontal',
            text: differencesArr[i].toString() + '%',
            style: {
              color: textColor,
              fontWeight: 500,
              fontSize: '12',
              background: borderColor,
            },
          },
        },
      ]);
    }
  }
  fillAnnotation(series);

  const chartOptions = useChart({
    annotations: {
      xaxis: barAxis,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: series[0].labels,
    },
    tooltip: {
      y: {
        formatter: (value: number) => ` ${value} `,
      },
    },
    plotOptions: { bar: { columnWidth: '36%' } },
  });

  return (
    <Chart dir="ltr" type="bar" series={series} options={chartOptions} width="100%" height={320} />
  );
}
