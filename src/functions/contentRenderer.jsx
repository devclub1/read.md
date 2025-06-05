import React from 'react';

export const computeRecursiveContent = (item, index) => {
  if (!item.children || item.children.length === 0) {
    return null;
  }

  const renderNestedItem = (nestedItem, nestedIndex, depth = 0) => {
    return (
      <div key={`${nestedIndex}`}>
        <div
          style={{ marginLeft: 1.5 * (depth + 1) + 'rem' }}
          dangerouslySetInnerHTML={{ __html: nestedItem.content }}
        />
        {
          nestedItem.children && nestedItem.children.length > 0 && (
            <div key={`${nestedIndex}-children`}>
              {nestedItem.children.map((childItem, childIndex) =>
                renderNestedItem(childItem, `${nestedIndex}-${childIndex}`, depth + 1)
              )}
            </div>
          )
        }
      </div>
    );
  };

  return (
    <div>
      {item.children.map((childItem, childIndex) =>
        renderNestedItem(childItem, `${index}-${childIndex}`)
      )}
    </div>
  );
}; 