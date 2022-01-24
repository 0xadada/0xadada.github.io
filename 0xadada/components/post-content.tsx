export default function PostContent({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
