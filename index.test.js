const index = require('./index');
const data = require('./stranger-things/testData');

const parsedData = data.data
const episodes = data.data._embedded.episodes

test('should return an object of episodes', () => {
    let result = index.structureEpisodes(episodes)
    expect(typeof result).toBe('object');
});
test('should return a decimal of 6.3', () => {
    let result = index.getAverageEpisodesPerSeason(episodes)
    expect(result).toBeGreaterThan(0);
    expect(result).toBeCloseTo(6.3);
});
test('should return total show runtime in seconds', () => {
    let result = index.getTotalEpisodeDurationSec(episodes)
    expect(result).toBeGreaterThan(0);
    expect(result).toEqual(91740);
});
test('should return the final obj as a string', () => {
    let result = index.createObj(parsedData)
    expect(typeof result).toBe('string');
});
test(`should return an episodes sequence num`, () => {
    let result = index.getEpisodeSequenceNum(episodes[0])
    expect(typeof result).toBe('string');
    expect(result).toBe('s1e1');
});
test(`should return an episodes airstamp`, () => {
    let result = index.getEpisodeAirstamp(episodes[0])
    expect(typeof result).toBe('number');
    expect(result).toBe(1468584000000);
});
test(`should return an episode's summary`, () => {
    let result = index.getEpisodeSummary(episodes[0])
    expect(typeof result).toBe('string');
    expect(result).toBe("A young boy mysteriously disappears, and his panicked mother demands that the police find him");
});
test(`should return an episode's title`, () => {
    let result = index.getEpisodeTitle(episodes[0])
    expect(typeof result).toBe('string');
    expect(result).toBe("The Vanishing of Will Byers");
});
