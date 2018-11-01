import { count, max, min, reduce, every, find, findIndex, isEmpty, defaultIfEmpty } from 'rxjs/operators'
import { of, from, range, empty } from 'rxjs';

of(1, 2, 3, 4).pipe(count()).subscribe(count => {
  console.log('--------count:', count)
})

from([{ a: 1 }, { a: 2 }]).pipe(max((a, b) => a.a - b.a)).subscribe(max => {
  console.log('----max:', max)
})

from([{ a: 1 }, { a: 2 }]).pipe(min((a, b) => a.a - b.a)).subscribe(max => {
  console.log('----min:', max)
})

range(1, 100).pipe(reduce((x, y) => x + y)).subscribe(total => {
  console.log('--------reduce:', total)
})

range(50, 100).pipe(every((x) => x > 0)).subscribe(total => {
  console.log('--------every:', total)
})

range(1, 100).pipe(find((x) => x > 50)).subscribe(total => {
  console.log('--------find:', total)
})

empty().pipe(isEmpty()).subscribe(bool => {
  console.log('isEmpty:', bool)
})

empty().pipe(defaultIfEmpty('default value')).subscribe(bool => {
  console.log('isEmpty:', bool)
})

range(50, 100).pipe(findIndex((x) => x > 70)).subscribe(total => {
  console.log('--------findIndex:', total)
})
