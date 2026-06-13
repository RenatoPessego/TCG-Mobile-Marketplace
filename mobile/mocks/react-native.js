const ReactNative = jest.requireActual('react-native');

// Mock FlatList para renderizar diretamente os dados
ReactNative.FlatList = ({ data, renderItem, keyExtractor }) => {
  return data.map((item, index) => {
    const key = keyExtractor ? keyExtractor(item, index) : index;
    return (
      <ReactNative.View key={key}>
        {renderItem({ item, index })}
      </ReactNative.View>
    );
  });
};

module.exports = ReactNative;
