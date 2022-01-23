import parseISO from "date-fns/parseISO";

export default function Posts({ posts }) {
  return (
    <ol>
      {posts.map(post => (
        <li key={post.date}>
          {post.title}
          <br />
          {`${new Date(post.date)}`}
        </li>
      ))}
    </ol>
  );
}
