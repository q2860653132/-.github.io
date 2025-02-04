// GitHub 配置
const GITHUB_CONFIG = {
    owner: 'q2860653132',  // 替换为你的 GitHub 用户名
    repo: 'homestay-map',         // 替换为你的仓库名
    token: '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'  // 新的 token
};

// 从 GitHub Issues 加载数据
async function loadFromGitHub() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues/1`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
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
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues/1`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                body: JSON.stringify(data)
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error('Failed to save data:', error);
        showToast('保存失败');
        return false;
    }
}

// 创建初始 Issue
async function createInitialIssue() {
    try {
        await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues`, {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
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
