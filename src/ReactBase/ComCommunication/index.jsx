/**
 * 组件通信方式、强化方式
 * 在react中一共有五种通信方式：props和callback、context(跨层级)、eventbus(事件总线)、ref传递、状态管理(redux等)
 */
import { useState } from 'react';

/**
 * 1.props和callback方式
 * @description 这种方式是react最常见、也是最基本的通讯方式，通常运用在父传子、子传父
 */
/**
 * 1.1 父传子
 * @description 所有的参数都通过props传递，需要注意的是，组件包裹的内容都在children中
 */
function Parent11() {
  const [num, setNum] = useState(0);
  return (
    <div>
      <h3>父组件</h3>
      <button onClick={() => setNum(num + 1)}>父组件按钮</button>
      <Child11 num={num}>hello,一起玩儿hooks</Child11>
    </div>
  );
}
function Child11(props) {
  const { num, children } = props;
  console.log(num, '121');
  return (
    <div style={{ border: '1px solid gray' }}>
      <h4>子组件</h4>
      <div>父组件传过来的Num: {num}</div>
      <div>{children}</div>
    </div>
  );
}

/**
 * 1.2 子传父
 * @description 子传父也称状态提升，通过父组件传递的callback函数，将状态传递给父组件
 */

function Parent12() {
  const [num, setNum] = useState(0);
  return (
    <div>
      <h3>父组件</h3>
      <div>子组件的num{num}</div>
      <Child12 numClick={setNum} num={num}>
        hello,一起玩儿hooks
      </Child12>
    </div>
  );
}
function Child12(props) {
  const { numClick, num, children } = props;
  console.log(num, '121');
  return (
    <div style={{ border: '1px solid gray' }}>
      <h4>子组件</h4>
      <button onClick={() => numClick(num + 1)}>{num}</button>
      <div>{children}</div>
    </div>
  );
}

function ComCommunication() {
  return (
    <div>
      {/* 1.1 父传子 */}
      <Parent11 />
      <div style={{ margin: '50px 0px', borderBottom: '1px solid red' }} />
      {/* 2.3 子传父 */}
      <Parent12 />
      <div style={{ margin: '50px 0px', borderBottom: '1px solid red' }} />
    </div>
  );
}
export default ComCommunication;
