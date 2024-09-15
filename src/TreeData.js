const treeData = [
  {
    key: 1,
    title: 'Node 1',
    children: [
      {
        key: 2,
        title: 'Node 1.1',
        children: [
          { key: 3, title: 'Node 1.1.1' },
          { key: 4, title: 'Node 1.1.2' },
        ],
      },
      {
        key: 5,
        title: 'Node 1.2',
      },
    ],
  },
  {
    key: 113,
    title: '困守长安时期',
    children: [
      { key: 9, title: '兵车行' },
      { key: 12, title: '春日忆李白' },
    ],
  },
  {
    key: 6,
    title: '漂泊西南时期',
    children: [
      { key: 10, title: '秋兴八首其二' },
      { key: 7, title: '秋兴八首其三' },
      { key: 13, title: '秋兴八首其四' },
      { key: 8, title: '哀江头' },
      { key: 11, title: '丹青引赠曹将军霸' },
      { key: 14, title: '存殁' },
    ],
  },
];

export default treeData;