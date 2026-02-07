type HeaderProps = {
  title: string;
  subtitle: string;
  tagline: string;
};

export function Header({ title, subtitle, tagline }: HeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--primary)]/70">
        {tagline}
      </p>
      <h1 className="text-3xl font-semibold text-[color:var(--primary)]">
        {title}
      </h1>
      <p className="max-w-2xl text-sm text-[color:var(--foreground)]/75">
        {subtitle}
      </p>
    </header>
  );
}
