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

function createdom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  // 过滤回调 筛选出所有不是children的属性
  const isProperty = key => key !== "children";
  // 遍历当前节点的所有属性 并将其添加
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name];
    });
  return dom
}

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}

// 初始化下一个工作单元
const nextUnitOfWork = null
// 工作循环
function workLoop(deadline) {
  let shouldYeild = false
  while (nextUnitOfWork && !shouldYeild) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  shouldYeild = deadline.timeRemaining() < 1
  requestIdleCallback(workLoop)
}
/**
 * @auth use requestIdleCallback to make a loop. You can think of requestIdleCallback as a setTimeout
 */
requestIdleCallback(workLoop)

/**
 * 创建并添加一个DOM
 * 创建一个信的Fiber
 * 返回下一个工作单元
 * @param {Fiber} fiber 
 */
function performUnitOfWork(fiber) {
  // 若当前的Fiber 没有 dom 这个属性 则使用 createdom 为其创建这个属性 
  if (!fiber.dom) {
    fiber.dom = createdom(fiber)
  }

  // 若fiber 有 父节点 则在其父节点上添加当前 feiber.dom 用于保持跟踪
  // We keep track of the DOM node in the fiber.dom property.
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  // 为每一个孩子节点创建 一个新的 Fiber
  const elements = fiber.props.children
  let index = 0
  let presilibing = null

  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    }
    // endOf 创建新的Fiber
    
    // TODO create new fibers
    // 如果是第一个节点 将使其变为孩子节点
    if (index === 0) {
      fiber.child = newFiber
    } else {
      // 若不是第一个节点 就将其设置为第一个孩子节点的兄弟节点
      presilibing.silibing = newFiber
    }

    presilibing.silibing = newFiber
    index++
  }

  // TODO return next unit of work
  // 保持对Fiber的跟踪 以此来寻找下一个工作单元 返回下一个渲染的工作单元
  // 若当前的Fiber有子节点 则下一个工作单元为其子节点
  if (fiber.child) {
    return fiber.child
  }

  // 如果没有子节点 但是有其兄弟节点  则返回其兄弟节点
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.silibing) {
      return nextFiber.silibing
    }
    nextFiber = nextFiber.silibing
  }
}

const Didact = {
  createElement,
  render
};

/** @jsx Didact.createElement */
const element = (
  <div>
    <h1>Here will build My First React App</h1>
    <h2 style="text-align:right">from LCG</h2>
  </div>
);
console.log(element);
const container = document.getElementById("root");
Didact.render(element, container);
