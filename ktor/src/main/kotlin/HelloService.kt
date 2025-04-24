package com.misaka

/**
 * 示例服务接口
 * 使用函数式接口定义，只包含一个抽象方法
 * 用于演示依赖注入和服务的实现
 */
fun interface HelloService {
    /**
     * 打印问候信息
     * 具体实现由依赖注入框架提供
     */
    fun sayHello()
}
