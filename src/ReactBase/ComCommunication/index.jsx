/**
 * 组件通信方式、强化方式
 * 在react中一共有五种通信方式：props和callback、context(跨层级)、eventbus(事件总线)、ref传递、状态管理(redux等)
 */
import React, { useState } from 'react';

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
  return (
    <div style={{ border: '1px solid gray' }}>
      <h4>子组件</h4>
      <button onClick={() => numClick(num + 1)}>{num}</button>
      <div>{children}</div>
    </div>
  );
}
/** ====================================================================================== */
/**
 * 2. context
 * @description 常用于上下文，用于实现祖代组件向后代组件跨层级传值
 * @step  1. 创建Context: React.createContext()。
 *        2. Provider: 提供者，外层提供数据的组件。
 *        3. Consumer: 消费者，内层获取数据的组件。
 */
/**
 * @demo 主题切换
 */
// class版本
const ThemeContext = React.createContext(null);

// 主题颜色
const theme = {
  dark: {
    color: '#5B8FF9',
    background: '#5B8FF9',
    border: '1px solid #5B8FF9',
    type: 'dark',
    buttonType: 'primary',
  },
  light: {
    color: '#E86452',
    background: '#E86452',
    border: '1px solid #E86452',
    type: 'light',
    buttonType: 'default',
  },
};

function ThemeParent() {
  const [themeContextValue, setThemeContextValue] = useState(theme.dark);

  return (
    <ThemeContext.Provider
      value={{ ...themeContextValue, setTheme: setThemeContextValue }}
    >
      {/* <ThemeChild /> */}
      <ContextChild />
    </ThemeContext.Provider>
  );
}

class ThemeChild extends React.Component {
  //  staic contextType 只适用于类中
  // 为新版消费的方式（注意版本在 React v16.6），这个静态属性（ contextType ）会指向需要获取的 context（也就是 ThemeContext ），
  // 这样就能通过 this.context 获取 Provider 提供的 contextValue。
  static contextType = ThemeContext;
  render() {
    return <FunComp {...this.context} />;
  }
}
function FunComp(props) {
  const { border, background, setTheme, color } = props;
  return (
    <div style={{ border, color, padding: 20 }}>
      <div>
        <span>选择主题：</span>
        <button style={{ background }} onClick={() => setTheme(theme.light)}>
          主题light
        </button>
        <button style={{ background }} onClick={() => setTheme(theme.dark)}>
          主题dark
        </button>
      </div>
      <div style={{ color }}>大家好，我是yangmy</div>
    </div>
  );
}

// useContext方式
function ContextChild() {
  const contextValue = React.useContext(ThemeContext);
  return <FunComp {...contextValue} />;
}

/** ====================================================================================== */

/**
 * 组件强化的四种方式: mixin 模式、extends 继承模式、高阶组件模式、自定义 Hooks 模式
 * @type  1.mixin: 模式(已废弃，不建议使用)
 *        2.extends 继承模式: 通过继承一步步的强化组件，extends Component/PureComponent
 *                  缺点： this的指向，super的传递(执行这个就代表执行了Component,不执行super就会导致拿不到props)， 繁琐的生命周期
 *        3.高阶组件: 基于react组合特性形成的一种特定模式，可以做很多事情，比如强化 props、条件渲染、性能优化、事件赋能、反向继承等
 *        4.自定义Hooks: 的是增加代码的可复用性、逻辑性，最主要的目的是解决了函数式组件无状态的问题，这样既保留了函数式的简单，又解决了没有数据管理状态的缺陷。
 */

/** ====================================================================================== */

function ComCommunication() {
  return (
    <div>
      {/* 1.1 父传子 */}
      <Parent11 />
      <div style={{ margin: '50px 0px', borderBottom: '1px solid red' }} />
      {/* 1.2 子传父 */}
      <Parent12 />
      <div style={{ margin: '50px 0px', borderBottom: '1px solid red' }} />
      {/* 2.context */}
      <ThemeParent />
    </div>
  );
}
export default ComCommunication;
