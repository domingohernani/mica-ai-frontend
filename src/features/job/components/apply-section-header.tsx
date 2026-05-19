const ApplySectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="mb-3">
        <p className="font-semibold">{title}</p>
        {description && (
            <p className="mt-0.5 text-sm">{description}</p>
        )}
    </div>
);
export default ApplySectionHeader