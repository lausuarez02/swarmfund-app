module.exports = function() {
  return {
    visitor: {
      MemberExpression(path) {
        if (
          path.get("object").isIdentifier({ name: "import" }) &&
          path.get("property").isIdentifier({ name: "meta" })
        ) {
          path.replaceWithSourceString("({ url: '' })");
        }
      }
    }
  };
}; 