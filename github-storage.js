// GitHub 配置
const GITHUB_CONFIG = {
    owner: 'q2860653132',  // 替换为你的 GitHub 用户名
    repo: 'homestay-map',         // 替换为你的仓库名
    token: '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'  // 替换为新生成的 token
};

// 从 GitHub Issues 加载数据
async function loadFromGitHub() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues/1`, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Homestay-Map'
            }
        });
        
        console.log('Load response status:', response.status);
        const responseText = await response.text();
        console.log('Load response:', responseText);
        
        if (response.status === 404) {
            console.log('Issue not found, creating new one...');
            await createInitialIssue();
            return {};
        } else {
            const data = JSON.parse(responseText);
            try {
                return JSON.parse(data.body || '{}');
            } catch (e) {
                console.error('Failed to parse issue body:', e);
                return {};
            }
        }
    } catch (error) {
        console.error('Failed to load data:', error.message);
        console.error('Error details:', error);
        return {};
    }
}

// 保存数据到 GitHub
async function saveToGitHub(data) {
    try {
        console.log('Saving data:', data);
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues/1`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Homestay-Map'
            },
            body: JSON.stringify({
                body: JSON.stringify(data)
            })
        });
        
        console.log('Save response status:', response.status);
        const responseText = await response.text();
        console.log('Save response:', responseText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
        }
        console.log('Save successful');
        showToast('保存成功');
        return true;
    } catch (error) {
        console.error('Failed to save data:', error.message);
        console.error('Error details:', error);
        showToast('保存失败');
        return false;
    }
}

// 创建初始 Issue
async function createInitialIssue() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Homestay-Map'
            },
            body: JSON.stringify({
                title: 'Homestay Data Storage',
                body: '{}'
            })
        });
        
        console.log('Create issue response status:', response.status);
        const responseText = await response.text();
        console.log('Create issue response:', responseText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
        }
    } catch (error) {
        console.error('Failed to create initial issue:', error.message);
        console.error('Error details:', error);
        showToast('创建初始 Issue 失败');
    }
} 