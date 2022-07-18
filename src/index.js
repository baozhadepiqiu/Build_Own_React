/**
 * 返回一个DOM节点并且递归自身的children 若children节点不是对象 则创建一个文本节点
 * @param {string} type DOM类型
 * @param {any} props 属性
 * @param  {...any} children 子节点
 * @returns Object
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}

/**
 * 返回一个文本节点
 * @param {string} text 文本内容
 * @returns TextElement
 */
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

/**
 * 渲染DOM函数 将需要渲染的DOM节点挂载到真实的DOM上
 * @param {Element} element 需要渲染的DOM
 * @param {Element} container DOM挂载的真实DOM
 */
function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  // 过滤回调 筛选出所有不是children的属性
  const isProperty = key => key !== "children";
  // 遍历当前节点的所有属性 并将其添加
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });
    // 递归的为每一个子节点渲染冰挂载到当前节点
  element.props.children.forEach(child => render(child, dom));
  // 当前节点所有的节点全部完成后一次性挂载到 container 容器中
  container.appendChild(dom);
}

const Didact = {
  createElement,
  render
};

/** @jsx Didact.createElement */
const element = (
  <div style="background: salmon">
    <h1>Hello World</h1>
    <h2 style="text-align:right">from Didact</h2>
  </div>
);

const container = document.getElementById("root");
Didact.render(element, container);
