import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>欢迎来到我们的网站</h1>
        <p>这是一个响应式设计的示例页面</p>
      </section>
      
      <section className="features">
        <div className="feature-card">
          <h2>特性 1</h2>
          <p>描述文本</p>
        </div>
        <div className="feature-card">
          <h2>特性 2</h2>
          <p>描述文本</p>
        </div>
        <div className="feature-card">
          <h2>特性 3</h2>
          <p>描述文本</p>
        </div>
      </section>
    </div>
  );
};

export default Home; 