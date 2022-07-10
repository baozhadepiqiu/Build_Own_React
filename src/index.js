import * as React from 'react';

/** @jsx Didact.createElement */
// 这里的JSX代码无法被解析
const element = <h1> hell</h1>
/**
 * 创建DOM树
 * @param {string} type 节点类型 
 * @param {Object} props 属性
 * @param  {...any} children 剩余的节点
 * @returns 可供 render 函数渲染的对象
 */
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) =>
                typeof child === "object" ? child : createTextElement(child)
            )
        }
    }
}

/**
 * 创建Text节点
 * @param {String} text 节点内文本内容
 * @returns Text节点的对象
 */
const createTextElement = (text) => {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    }
}

/**
 * 接收一个DOM树对象 将其渲染成DOM
 * @param {element} element DOM对象
 * @param {Element} container 挂载的DOM
 */
const render = (element, container) => {
    // 若当前节点是一个 文本 则直接渲染这个 文本 节点
    const dom = element.type === "TEXT_ELEMENT" ?
        document.createTextNode("") : document.createElement(element.type)

    // 该方法返回 element 所有的属性
    Object.keys(element.props)
        .filter(key => key !== "children")
        .forEach((name) =>   /* 将 children 以外的所有属性赋值给 dom */
            dom[name] = element.props[name]
        )

    // 渲染Children
    element.props.children.forEach((child) => {
        render(child, dom)
    });
    container.appendChild(dom)
}

const Didact = {
    createElement,
    render
}

let container = document.getElementById("app");
Didact.render(element, container)