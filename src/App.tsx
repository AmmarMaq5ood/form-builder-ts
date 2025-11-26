import FormBuilder from "./components/FormBuilder/FormBuilder";
import ThemeSwitcher from "./components/ThemeSwitcher/ThemeSwitcher";

function App() {
  return (
    <div className="min-h-screen themed-app p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col gap-3 text-center lg:text-left">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
              Form Builder
            </h1>
            <p className="text-[var(--text-muted)]">
              Drag and drop elements to build your form.
            </p>
          </div>
          <div className="flex justify-center lg:justify-start">
            <ThemeSwitcher />
          </div>
        </header>
        <main>
          <FormBuilder />
        </main>
      </div>
    </div>
  );
}

export default App;
