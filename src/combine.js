import { concatAll, zipAll, combineAll, take, map, mergeAll } from 'rxjs/operators'
import { interval, of } from 'rxjs'

interval(1000).pipe(take(2)).pipe(map(n => {
  return interval(1500).pipe(map(m => `${n}:${m}`), take(2))
})).pipe(concatAll()).subscribe(v => {
  console.log('concatAll', v)
})

interval(1000).pipe(take(2)).pipe(map(n => {
  return interval(1500).pipe(map(m => `${n}:${m}`), take(2))
})).pipe(mergeAll()).subscribe(v => {
  console.log('mergeAll:', v)
})

interval(1000).pipe(take(2)).pipe(map(n => {
  return interval(1500).pipe(map(m => `${n}:${m}`), take(2))
})).pipe(combineAll()).subscribe(v => {
  console.log('combineAll:', v)
})

interval(1000).pipe(take(2)).pipe(map(n => {
  return interval(1500).pipe(map(m => `${n}:${m}`), take(2))
})).pipe(zipAll()).subscribe(v => {
  console.log('zipAll:', v)
})