/**
 * 什么是自定义hook
 *      自定义hook是基于react-hook基础上的一个拓展，他可以根据实际的业务场景、需求制定相应的hooks，将对应的逻辑进行封装，从而具备逻辑性、复用性
 */
import React, { useState, useReducer, useRef, useEffect } from 'react';

// 获取最新值
function useLatest(param) {
  const ref = useRef(param);
  ref.current = param;
  return ref;
}

// 初始化hooks
function useMount(fn) {
  useEffect(() => {
    fn?.();
  }, []);
}
// 卸载hooks
function useUnMount(fn) {
  const ref = useLatest(fn);
  useEffect(() => {
    return () => {
      ref.current();
    };
  }, []);
}
// 判断组件是否卸载
function useUnmountedRef() {
  const unmountedRef = useRef(false);
  useMount(() => {
    unmountedRef.current = false;
  });
  useUnMount(() => {
    unmountedRef.current = true;
  });
  return unmountedRef;
}

// 强制渲染组件
// 搞个累加器，无关的变量，触发一次，就累加 1，这样就会强制刷新。
function useUpdate() {
  const [, update] = useReducer((num) => num + 1, 0);
  return update;
}

function Child() {
  const mountedRef = useUnmountedRef();
  useMount(() => {
    console.log('加载', mountedRef);
  });
  useUnMount(() => {
    console.log('卸载了', mountedRef);
  });
  return 'child';
}
function Index(params) {
  const [flag, setFlag] = useState(true);
  const [count, setCount] = useState(0);
  const countRef = useLatest(count);
  const update = useUpdate();

  useEffect(() => {
    // const interval = setInterval(() => {
    //   //   console.log('count:', count);
    //   //   console.log('ref:', countRef);
    //   setCount(countRef.current + 1);
    // }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {/* <div>自定义Hooks：useLatestt</div>
      <div>count: {count}</div> */}
      <button onClick={() => setFlag(!flag)}>切换</button>
      <button onClick={() => update()}>update</button>
      {flag && <Child />}
      <div>{Date.now()}</div>
    </>
  );
}

export default Index;
