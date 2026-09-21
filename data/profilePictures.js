const AVATAR_IDS = [
    '44985295-3d9e-4ca6-b61a-322f86fa9499',
    'ab01a1d0-7bb4-4856-90c6-6dd4a384c9dd',
    'a48a3db5-8867-48d5-b910-41c84d1bda31',
    '539df699-6d04-4ce8-ac95-f47f87d97186',
    'b49bdd6e-4d12-4fbc-a15c-7fc65da4a734',
    'e2978242-6af5-47a3-8415-3bc90ebde61f',
    '84ca5900-516a-441b-aee1-8168c1ad772a',
    'f2f33e24-6f7e-461c-b7a7-b8c299e7ff1f',
    '5b74a1fa-b3ce-4f72-8454-5d22f76bdbf6',
    '27954c3a-93c5-456e-b32c-89b1e4845415',
    '9130a156-ccc1-4a8a-8c03-dc3a2542d05b',
    'c9da03dc-7fc7-406e-ab15-6fef4e590a82',
    'c3f072d9-1f84-4b6a-8283-bb4803f44d8c',
    '9801f2c5-500e-40bd-99cf-3fd054e4d4d8',
    '4d5ef2dc-56b3-49b7-9c23-4c268b85a00b',
    'e2755636-86eb-46dc-90a7-dadb0781e2ab',
    'a3b0df3f-1593-444d-a7c8-1fac16ffa123',
    '39ee3f89-6b79-4f0d-a342-8bb8469a8c96',
    '8f7da571-ba37-432d-87ea-a2d668d083f3',
    'aaa23221-63c1-4168-b441-117c2238c084',
    '4e82d96e-71f7-4f84-bf30-ede0569afd1f',
    '6f9c423d-4d75-41bf-a8e7-3d0e7d5852fc',
    '6015f30a-181b-4d2d-8d4c-93d70229db0f',
    '4ab03395-d962-4eed-9ff8-980f7793225e',
    'a09fc712-98c8-4b56-b7ff-0c216fe55287',
    'b64c6d61-8cb6-4cd5-a972-6c6335fcf232',
    'bfcb20c7-29d8-41b7-86df-2618d094ab85',
    'b9561d92-0624-4b6c-ad34-b08bf5d2c8ae'
];

const SIZE = 128;

const hashString = (value) => {
    let hash = 0;
    for (const ch of String(value ?? 'user')) {
        hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    }
    return hash;
};

const profilePictureFor = (seed) => {
    const id = AVATAR_IDS[hashString(seed) % AVATAR_IDS.length];
    return `https://avatars.tzador.com/face?id=${id}&size=${SIZE}`;
};

module.exports = { AVATAR_IDS, profilePictureFor };