function genkitPlugin(pluginName, initFn) {
  return (genkit) => ({
    name: pluginName,
    initializer: async () => {
      await initFn(genkit);
    }
  });
}
export {
  genkitPlugin
};
//# sourceMappingURL=plugin.mjs.map