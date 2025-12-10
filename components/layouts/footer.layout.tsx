export default function Footer() {
  return (
    <footer className="border-t border-muted-foreground px-4 py-8 mx-16">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-primary/60 text-sm">
          © 2024 Discipline. All rights reserved.
        </p>

        <div className="flex gap-6 text-sm">
          <a className="text-primary/80 hover:text-primary transition-colors" href="#">
            About
          </a>
          <a className="text-primary/80 hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="text-primary/80 hover:text-primary transition-colors" href="#">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
