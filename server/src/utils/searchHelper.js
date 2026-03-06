const buildSearchQuery = (query, userId) => {
  const searchFilter = {
    $or: [
      { owner: userId },
      { 'collaborators.user': userId },
    ],
  };

  if (query) {
    searchFilter.$and = [
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } },
        ],
      },
    ];
  }

  return searchFilter;
};

module.exports = { buildSearchQuery };
