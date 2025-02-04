// GitHub 配置
const GITHUB_CONFIG = {
    owner: 'q2860653132',  // 替换为你的 GitHub 用户名
    repo: 'homestay-map',         // 替换为你的仓库名
    token: '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'      // 替换为你的 GitHub Token
};

// 从 GitHub Issues 加载数据
async function loadFromGitHub() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues/1`, {
            headers: {
                'Authorization': `Bearer ${GITHUB_CONFIG.token}`
            }
        });
        
        if (response.status === 404) {
            // 如果 issue 不存在，创建一个新的
            await createInitialIssue();
            return {};
        } else {
            const data = await response.json();
            return JSON.parse(data.body || '{}');
        }
    } catch (error) {
        console.error('Failed to load data:', error);
        return {};
    }
}

// 保存数据到 GitHub
async function saveToGitHub(data) {
    try {
        await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues/1`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                body: JSON.stringify(data)
            })
        });
    } catch (error) {
        console.error('Failed to save data:', error);
        showToast('保存失败');
    }
}

// 创建初始 Issue
async function createInitialIssue() {
    try {
        await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Homestay Data Storage',
                body: '{}'
            })
        });
    } catch (error) {
        console.error('Failed to create initial issue:', error);
    }
} 