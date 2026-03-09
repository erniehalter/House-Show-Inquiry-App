import Form from './components/Form';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            House Show Booking Inquiry
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Get an instant quote for your event and submit an inquiry to Ernie Halter.
          </p>
        </div>

        <Form />

        <div className="mt-12 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Ernie Halter Music. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
