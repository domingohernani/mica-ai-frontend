type PageHeaderProps = {
  title: string;
  subtitle: string;
};

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default PageHeader;
