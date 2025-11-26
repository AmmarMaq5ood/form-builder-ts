import FormBuilder from "./components/FormBuilder/FormBuilder";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Form Builder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Drag and drop elements to build your form.
          </p>
        </header>
        <main>
          <FormBuilder />
        </main>
      </div>
    </div>
  );
}

export default App;
