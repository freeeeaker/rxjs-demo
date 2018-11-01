import {
  Observable,
  of,
  range,
  generate,
  empty,
  never,
  throwError,
  interval,
  timer,
  from,
  fromEvent,
  fromEventPattern,
  defer,
  concat,
  merge,
  zip,
  combineLatest,
  race,
  forkJoin
} from 'rxjs'
import { ajax } from 'rxjs/ajax'
import {
  repeat,
  map,
  scan,
  repeatWhen,
  withLatestFrom,
  startWith,
  take
} from 'rxjs/operators'
import EventEmitter from 'events'

Observable.create(function (observer) {
  observer.next(1)
  observer.next(2)
  observer.complete()
}).subscribe(next => {
  console.log('create:')
  console.log(next)
}, null, () => console.log('create done'))

new Observable(function (observer) {
  observer.next(1)
  observer.next(2)
  observer.complete()
}).subscribe(next => {
  console.log('new Observable:')
  console.log(next)
}, null, () => {
  console.log('new Observable done')
})

of('a', 'b', 'c').subscribe(next => {
  console.log('of:')
  console.log(next)
}, null, () => console.log('of done'))

range(1, 5).subscribe(next => {
  console.log('range:')
  console.log(next)
})

generate(5, x => x > 0, x => x - 1).pipe(repeat(5)).subscribe(next => {
  console.log('generate:')
  console.log(next)
})

empty().subscribe({ complete: () => console.log('empty:') })
never()
throwError(new Error('throw error')).subscribe({ error: error => console.log(error) })

interval(1000).pipe(map(n => 2 * n)).subscribe(x => {
  // console.log('interval:', x)
  document.getElementById('interval').innerHTML = x
})

timer(2000, 1000).subscribe({
  next: next => {
    document.getElementById('timer').innerHTML = next
  },
  complete: () => console.log('timer complete:')
})

from([1, 2, 3]).subscribe(next => {
  console.log('from:', next)
})

from(new Promise(function (resolve) {
  setTimeout(() => resolve('resolved'), 1000)
})).subscribe(next => {
  console.log('from promise:', next)
})

from(of(1)).subscribe(next => {
  console.log('from observable:', next)
})

from('abcd').subscribe(next => {
  console.log('from string:', next)
})

fromEvent(document.getElementById('add'), 'click')
  .pipe(scan((total, _) => total + 1, 0))
  .subscribe(val => {
    document.getElementById('total').innerHTML = val
  })

const emitter = new EventEmitter()

fromEvent(emitter, 'msg')
  .subscribe(next => {
    console.log('fromEvent EventEmitter:', next)
  })

emitter.emit('msg', 123, 456)
emitter.emit('another-msg', 'abc')

const customEvent = {
  events: {},
  on: function (event, fn) {
    if (this[event]) {
      this.events[event].push(fn)
    } else {
      this.events[event] = [fn]
    }
  },
  off: function (event, fn) {
    if (this.events[event]) {
      var index = this.events[event].indexOf(fn)
      if (index !== -1) {
        console.log('off custom event')
        this.events[event].splice(index, 1)
      }
    }
  },
  fire: function (name, value) {
    if (this.events[name]) {
      this.events[name].forEach(fn => fn(value))
    }
  }
}

const fromEventPattern$ = fromEventPattern(function (handler) {
  customEvent.on('custom-emit', handler)
}, function (handler) {
  customEvent.off('custom-emit', handler)
}).subscribe(next => {
  console.log('fromEventPattern:', next)
})

customEvent.fire('custom-emit', 'custom-emit')

fromEventPattern$.unsubscribe()

fromEvent(document.getElementById('ajax'), 'click')
  .subscribe(ev => {
    ajax('https://api.github.com/repos/ReactiveX/rxjs', { responseType: 'json' })
      .subscribe(value => {
        if (value && value.response) {
          document.getElementById('ajaxHTML').innerHTML = value.response.stargazers_count
        }
      })
  })

of('abc:').pipe(repeatWhen((notifer$) => {
  return interval(1000)
})).subscribe(next => {
  document.getElementById('r1').innerHTML = next + Math.random()
})

customEvent.fire('custom-emit-r1', 'custom-emit-r1')

fromEventPattern(function (handler) {
  customEvent.on('custom-emit-r2', handler)
}, function (handler) {
  customEvent.off('custom-emit-r2', handler)
}).pipe(repeatWhen((notifer$) => {
  return notifer$.delay(2000)
})).subscribe(next => {
  document.getElementById('r2').innerHTML = next + Math.random()
})

customEvent.fire('custom-emit-r2', 'custom-emit-r2')

// ajax('https://api.github.com/repos/ReactiveX/rxjs', { responseType: 'json' })

const defer$ = defer(() => new Promise((resolve) => setTimeout(() => { resolve('defer 2000') }, 2000)))
defer$.subscribe(next => {
  console.log(next)
})

from(new Promise((resolve => {
  console.log('not use defer promise')
  setTimeout(resolve, 1000)
}))).subscribe(() => {
  console.log('not use defer promise after 1000')
})

const source1$ = of(1, 2, 3)
const source2$ = of('a', 'b', 'c', 'd')
const source3$ = from(new Promise((resolve) => {
  setTimeout(() => resolve('source3$'), 1000)
}))
const source4$ = interval(500)
const source5$ = interval(2000)

concat(source1$, source2$, source3$).subscribe(val => {
  console.log('concat:')
  console.log(val)
})
merge(source3$, source1$).subscribe(val => {
  console.log('merge:')
  console.log(val)
})
const touchAndClick = document.querySelector('#touchAndClick')

merge(fromEvent(touchAndClick, 'click'), fromEvent(touchAndClick, 'touchend'))
  .subscribe(ev => {
    alert(ev.type)
  })

zip(source1$, source2$, source4$).subscribe(val => {
  // 当有一个结束就结束
  console.log('zip:')
  console.log(val)
})

combineLatest(source1$, source2$, source4$, function (a, b, c) {
  return `a:${a}, b: ${b}, c: ${c}`
}).subscribe(val => {
  // 总是同步所有源 的最近一次数据
  // 所有源完结才完结
  console.log('combineLatest:')
  console.log(val)
})

source5$.pipe(withLatestFrom(source4$)).subscribe(val => {
  console.log('withlatestForm:')
  console.log('val')
})

race(from(new Promise((resolve) => {
  setTimeout(() => resolve('race------1'), 300)
}, from(new Promise((resolve) => {
  setTimeout(() => resolve('race2'), 200)
}))))).subscribe(val => {
  console.log('race:')
  console.log(val)
})

of('from source').pipe(startWith('first', 'second'))
  .subscribe(val => {
    console.log('startWidth:')
    console.log(val)
  })

forkJoin(source4$.pipe(take(2)), source5$.pipe(take(3))).subscribe({
  next: val => console.log('----forkJoin:', val),
  complete: () => console.log('forkJoin complete')
})