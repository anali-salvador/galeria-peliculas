export default function Footer() {
  return (
    <footer className="mt-auto px-4 pt-10 sm:px-6 lg:px-8">
      <div className="ticket-stub mx-auto max-w-7xl rounded-b-none bg-platea px-6">
        <div className="border-t-2 border-dashed border-acento-1/40 py-7 text-center text-sm text-lavanda/80">
          Datos de{' '}
          <a
            href="https://www.omdbapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm font-semibold text-acento-1 underline-offset-4 hover:underline"
          >
            OMDb API
          </a>
        </div>
      </div>
    </footer>
  )
}
