import LocaleSwitcher from './LocaleSwitcher';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} InvoiceBox. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Language:</span>
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
