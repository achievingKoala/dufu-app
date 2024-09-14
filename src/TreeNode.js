import React from 'react';

// TreeNode component
const TreeNode = ({ node }) => {

const handleClick = (nodeName) => {
    alert(`Clicked on ${nodeName}`);
    };
  return (
    <li>
      {node.children ? (
        node.name
      ) : (
        <button onClick={() => handleClick(node.name)}>{node.name}</button>
      )}
      {node.children && (
        <ul>
          {node.children.map(childNode => (
            <TreeNode key={childNode.id} node={childNode} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;