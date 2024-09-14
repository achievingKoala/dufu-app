import TreeNode from './TreeNode'

const Tree = ({ data }) => {
  return (
    <ul>
      {data.map(node => (
        <TreeNode key={node.id} node={node} />
      ))}
    </ul>
  );
};

export default Tree;