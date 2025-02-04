const MainComponent = () => {
  const [value, updateValue] = React.useState(0);

  const handleClick = () => {
    updateValue(prev => prev + 1);
  };

  return (
    <main>
      <header>
        <h1>Number Tracker</h1>
      </header>
      <section>
        <span>Current Value: {value}</span>
        <div>
          <button type="button" onClick={handleClick}>
            Increase
          </button>
        </div>
      </section>
    </main>
  );
};

export default MainComponent; 