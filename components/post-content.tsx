export default function PostContent({ content }) {
  return (
    <div
      className="entry-content e-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
