import DisplayDate from "./display-date.tsx";

export default function Posts({ posts }) {
  return (
    <ol>
      {posts.map(post => (
        <li key={post.title}>
          {post.title}
          <br />
          <span>{post.metaDescription}</span>
          <br />
          <DisplayDate datetime={post.date} />
        </li>
      ))}
    </ol>
  );
}
