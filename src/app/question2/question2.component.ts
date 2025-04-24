import {Component, OnInit} from '@angular/core';

type Range = [number, number];

interface Camera {
  distance: Range;
  light: Range;
}

@Component({
  selector: 'app-question2',
  imports: [],
  templateUrl: './question2.component.html',
  styleUrl: './question2.component.css'
})
export class Question2Component implements OnInit {

  constructor() {
  }

  ngOnInit() {
    document.title = 'Question 2 Solve';

    const desiredDistance1: Range = [60, 100];
    const desiredLight1: Range = [50, 100];

    const hardwareCameras1: Camera[] = [
      {distance: [0, 50], light: [0, 100]},
      {distance: [1, 100], light: [50, 100]},
      {distance: [1, 400], light: [20, 1000]}
    ];

    console.log(this.isCoverageSufficient(desiredDistance1, desiredLight1, hardwareCameras1));
    // true
    // console.log(this.isCoverageSufficientBruteForce(desiredDistance1, desiredLight1, hardwareCameras1));

    const desiredDistance2: Range = [0, 100];
    const desiredLight2: Range = [0, 100];

    const hardwareCameras2: Camera[] = [
      {distance: [0, 40], light: [0, 100]},
      {distance: [60, 100], light: [0, 100]}
    ];

    console.log(this.isCoverageSufficient(desiredDistance2, desiredLight2, hardwareCameras2));
    // false
    // console.log(this.isCoverageSufficientBruteForce(desiredDistance2, desiredLight2, hardwareCameras2));

  }

  // This is brute-force approach which is much simple, but the
  // performance is not great when hardwareCameras is more.
  // isCoverageSufficientBruteForce(
  //   desiredDistance: Range,
  //   desiredLight: Range,
  //   hardwareCameras: Camera[]
  // ) {
  //   const [minDist, maxDist] = desiredDistance;
  //   const [minLight, maxLight] = desiredLight;
  //   let step = 0;
  //   for (let d = minDist; d <= maxDist; d += step) {
  //     for (let l = minLight; l <= maxLight; l += step) {
  //       const isCovered = hardwareCameras.some(cam =>
  //         cam.distance[0] <= d && d <= cam.distance[1] &&
  //         cam.light[0] <= l && l <= cam.light[1]
  //       );
  //       if (!isCovered) return false;
  //     }
  //   }
  //   return true;
  // }

  isCoverageSufficient(
    desiredDistance: Range,
    desiredLight: Range,
    hardwareCameras: Camera[]
  ): boolean {
    const [minDist, maxDist] = desiredDistance;
    const [minLight, maxLight] = desiredLight;

    // Collect all unique "event points" where distance coverage starts/ends
    const breakpoints = new Set<number>();
    hardwareCameras.forEach(cam => {
      const [start, end] = cam.distance;
      breakpoints.add(start);
      breakpoints.add(end);
    });
    breakpoints.add(minDist);
    breakpoints.add(maxDist);

    const sortedBreaks = Array.from(breakpoints).sort((a, b) => a - b);
    console.log({sortedBreaks})

    // Now check each segment between breakpoints
    for (let i = 0; i < sortedBreaks.length - 1; i++) {
      const segStart = sortedBreaks[i];
      const segEnd = sortedBreaks[i + 1];

      if (segEnd <= segStart) continue; // Skip degenerate segments

      const midPoint = (segStart + segEnd) / 2;

      // Collect light ranges from cameras that cover this distance slice
      const lightRanges: Range[] = hardwareCameras
        .filter(cam => cam.distance[0] <= midPoint && midPoint <= cam.distance[1])
        .map(cam => cam.light);
      console.log({lightRanges})


      let merged = this.mergeIntervals(lightRanges);
      // merged = [];
      console.log({merged})
      // Check if merged intervals fully cover the desired light range
      if (!this.isRangeCovered(merged, [minLight, maxLight])) {
        return false;
      }
    }

    return true;
  }

  mergeIntervals(intervals: Range[]): Range[] {
    if (intervals.length === 0) return [];

    intervals.sort((a, b) => a[0] - b[0]);

    const result: Range[] = [];
    let [start, end] = intervals[0];

    for (let i = 1; i < intervals.length; i++) {
      const [curStart, curEnd] = intervals[i];
      if (curStart <= end) {
        end = Math.max(end, curEnd);
      } else {
        result.push([start, end]);
        [start, end] = intervals[i];
      }
    }

    result.push([start, end]);
    return result;
  }

  isRangeCovered(merged: Range[], target: Range): boolean {
    let [tStart, tEnd] = target;

    for (const [start, end] of merged) {
      if (start > tStart) return false;
      if (end >= tEnd) return true;
      tStart = end;
    }

    return false;
  }


}
