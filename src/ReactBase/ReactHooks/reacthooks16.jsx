/**
 * React16.8Hooks
 * @type  1.useState:  和setState的区别。setState是合并处理，useState直接替换。setState执行后都会更新，useState则会进行一个简单的比较
 *        2.useEffect: 副作用钩子，弥补了函数式组件没有生命周期的缺陷。返回一个函数，在组件销毁时执行
 *        3.useContext: 上下文，类似于 Context，其本意就是设置全局共享数据，使所有组件可跨层级实现共享。参数是createContext的context
 *        4.useReducer: 类似于redux，单个组件的状态管理。useState的升级版。和useState一样，会做一个简单的比较，不变化时不触发更新
 *          @params [reducer]: 函数，可以理解为 redux 中的 reducer，最终返回的值就是新的数据源 state
 *                  [initialArg]: 初始默认值
 *                  [init]: 惰性初始化，可选值。
 *        5.useMemo: 理念与 memo 相同，都是判断是否满足当前的限定条件来决定是否执行callback 函数。它之所以能带来提升，是因为在依赖不变的情况下，会返回相同的引用，避免子组件进行无意义的重复渲染
 *        6.useCallback: 与 useMemo 极其类似，甚至可以说一模一样，唯一不同的点在于，useMemo 返回的是值，而 useCallback 返回的是函数,且需要配合memo来使用
 *                        使用来处理传给子组件的方法，当父组件更新时，传给子组件的方法就相当于一个新的变量，此时子组件发现接收到的方法是新的，就会渲染更新，useCallback和memo组合使用之后
 *                        就会缓存这个函数，在父组件更新后传给子组件的扔是之前的函数，就避免了不必要的渲染
 *        7.useRef: 用于获取当前元素的所有属性，除此之外，还有一个高级用法：缓存数据
 *        8.useImperativeHandle: 可以通过 ref 或 forwardRef(父组件是class组件时必须要用) 暴露给父组件的实例值，所谓的实例值是指值和函数
 *        9.useLayoutEffect: 与 useEffect 基本一致，不同点在于它是同步执行的(可能存在阻塞效果，所以一般都用useEffect)
 *             执行顺序：useLayoutEffect 是在 DOM 更新之后，浏览器绘制之前的操作，这样可以更加方便地修改 DOM，获取 DOM 信息，这样浏览器只会绘制一次，所以 useLayoutEffect 的执行顺序在 useEffect 之前；
 *             useLayoutEffect 相当于有一层防抖效果；
 *             useLayoutEffect 的 callback 中会阻塞浏览器绘制。
 *        10.useDebugValue
 */

import React from 'react';

/**
 * useReducer 例子
 */
function UseReducerExample(params) {
  const [count, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case 'add':
        return state + action.payload;
      case 'delete':
        return state - action.payload;
      default:
        return state;
    }
  }, 0);
  return (
    <div>
      {count}
      <button
        type="button"
        onClick={() => dispatch({ type: 'add', payload: 1 })}
      >
        add
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: 'delete', payload: 1 })}
      >
        delete
      </button>
    </div>
  );
}

/**
 * useCallback ；例子
 */

function UseCallbackExample() {
  const handleClick = React.useCallback(() => {
    console.log(121);
  }, []);
  return (
    <div>
      <div onClic={handleClick}>sad</div>
    </div>
  );
}

/**
 * useRef 例子
 */
function UseRefExample() {
  const scrollRef = React.useRef(null);
  const [clientHeight, setClientHeight] = React.useState(0);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [scrollHeight, setScrollHeight] = React.useState(0);

  const onScroll = () => {
    if (scrollRef?.current) {
      let clientHeight = scrollRef?.current.clientHeight; // 可视区域高度
      let scrollTop = scrollRef?.current.scrollTop; // 滚动条滚动高度
      let scrollHeight = scrollRef?.current.scrollHeight; // 滚动内容高度
      setClientHeight(clientHeight);
      setScrollTop(scrollTop);
      setScrollHeight(scrollHeight);
    }
  };

  return (
    <>
      <div>
        <p>可视区域高度：{clientHeight}</p>
        <p>滚动条滚动高度：{scrollTop}</p>
        <p>滚动内容高度：{scrollHeight}</p>
      </div>
      <div
        style={{ height: 200, border: '1px solid #000', overflowY: 'auto' }}
        ref={scrollRef}
        onScroll={onScroll}
      >
        <div style={{ height: 2000 }} />
      </div>
    </>
  );
}

/**
 * useImperativeHandle 例子
 */
/**
 * 父组件是函数组件
 *  ref：接受 useRef 或 forwardRef 传递过来的 ref；
 *  createHandle：处理函数，返回值作为暴露给父组件的 ref 对象；
 *  deps：依赖项，依赖项如果更改，会形成新的 ref 对象。
 */

const Child = ({ cRef }) => {
  const [count, setCount] = useState(0);

  React.useImperativeHandle(cRef, () => ({
    add,
  }));

  const add = () => {
    setCount((v) => v + 1);
  };

  return (
    <div>
      <p>点击次数：{count}</p>
      <button onClick={() => add()}> 子组件的按钮，点击+1</button>
    </div>
  );
};

const Index = () => {
  const ref = React.useRef(null);

  return (
    <>
      <div>大家好，我是小杜杜，一起学习hooks吧！</div>
      <div />
      <button type="primary" onClick={() => ref.current.add()}>
        父组件上的按钮，点击+1
      </button>
      <Child cRef={ref} />
    </>
  );
};

/**
 * 父组件是类数组件
 *  当前的父组件是 Class 组件，此时不能使用 useRef，而是需要用 forwardRef 来协助我们处理
 *  forwardRef：引用传递，是一种通过组件向子组件自动传递引用 ref 的技术。对于应用者的大多数组件来说没什么作用，但对于一些重复使用的组件，可能有用。
 *  forwardRef 包裹后，会将 props（其余参数）和 ref 拆分出来，ref 会作为第二个参数进行传递。如：
 */
const ChildRef = (props, ref) => {
  const [count, setCount] = React.useState(0);

  React.useImperativeHandle(ref, () => ({
    add,
  }));

  const add = () => {
    setCount((v) => v + 1);
  };

  return (
    <div>
      <p>点击次数：{count}</p>
      <button onClick={() => add()}> 子组件的按钮，点击+1</button>
    </div>
  );
};

const ForwardChild = React.forwardRef(ChildRef);

class IndexRef extends React.Component {
  countRef = null;
  render() {
    return (
      <>
        <div>大家好，我是小杜杜，一起学习hooks吧！</div>
        <div />
        <button type="primary" onClick={() => this.countRef.add()}>
          父组件上的按钮，点击+1
        </button>
        <ForwardChild ref={(node) => (this.countRef = node)} />
      </>
    );
  }
}

/**
 * useLayoutEffect
 * 问：既然 useEffect 会执行两次渲染，导致回流和重绘，相比之下， useLayoutEffect 的效果要更好，那么为什么都用 useEffect 而不用 useLayoutEffect 呢？
   答：根本原因还是同步和异步，虽然 useLayoutEffect 只会渲染一次，但切记，它是同步，类比于 Class 组件中，它更像 componentDidMount，因为它们都是同步执行。既然是同步，就有可能阻塞浏览器的渲染，而 useEffect 是异步的，并不会阻塞渲染。
      其次，给用户的感觉不同，对比两者的执行顺序，useLayoutEffect 要经过本身的回调才设置到 DOM 上，也就是说， useEffect 呈现的速度要快于 useLayoutEffect，让用户有更快的感知。
      最后，即使 useEffect 要渲染两次，但从效果上来看，变换的时间非常短，这样情况下，也无所谓，除非闪烁、突兀的感觉非常明显，才会去考虑使用 useLayoutEffect 去解决。
 */

export default Index;
