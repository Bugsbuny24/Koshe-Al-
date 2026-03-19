interface PreviewFrameProps {
  url?: string;
  html?: string;
}

export function PreviewFrame({ url, html }: PreviewFrameProps) {
  if (!url && !html) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] text-[#4A4845]">
        Önizleme yükleniyor...
      </div>
    );
  }

  return (
    <iframe
      src={url}
      srcDoc={html}
      className="h-full w-full rounded-xl border border-[rgba(240,165,0,0.12)] bg-white"
      sandbox="allow-scripts allow-same-origin"
      title="Preview"
    />
  );
}
