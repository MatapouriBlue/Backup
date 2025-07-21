import json
import os
from datetime import datetime
from typing import Dict, Any, Optional

class BackupManager:
    """Manages file-based backup system for Vercel deployment"""
    
    def __init__(self):
        self.file_backup_dir = "backups"
        self.ensure_backup_dir()
    
    def ensure_backup_dir(self):
        """Create backup directory if it doesn't exist"""
        if not os.path.exists(self.file_backup_dir):
            os.makedirs(self.file_backup_dir)
    
    def backup_philosophy_content(self, title: str, text1: str, text2: str) -> bool:
        """Backup philosophy content to file"""
        content = {
            'title': title,
            'text1': text1,
            'text2': text2,
            'timestamp': datetime.utcnow().isoformat(),
            'backup_type': 'philosophy_content'
        }
        
        # File backup only
        return self._backup_to_file('philosophy_content', content)
    
    def backup_project_files(self) -> bool:
        """Create a complete backup of project files"""
        try:
            backup_data = {
                'timestamp': datetime.utcnow().isoformat(),
                'backup_type': 'full_project',
                'files': {}
            }
            
            # Backup key project files
            important_files = [
                'app.py',
                'routes.py',
                'models.py',
                'static/css/style.css',
                'templates/index.html',
                'templates/base.html',
                'static/philosophy_content.json'
            ]
            
            for file_path in important_files:
                if os.path.exists(file_path):
                    with open(file_path, 'r', encoding='utf-8') as f:
                        backup_data['files'][file_path] = f.read()
            
            # Save to file
            return self._backup_to_file('full_project', backup_data)
            
        except Exception as e:
            print(f"Project backup error: {e}")
            return False
    
    def restore_philosophy_content(self) -> Optional[Dict[str, Any]]:
        """Restore philosophy content from file backup"""
        return self._restore_from_file('philosophy_content')
    
    def _backup_to_file(self, backup_type: str, content: Dict[str, Any]) -> bool:
        """Backup content to JSON file"""
        try:
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
            filename = f"{backup_type}_{timestamp}.json"
            file_path = os.path.join(self.file_backup_dir, filename)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(content, f, indent=2, ensure_ascii=False)
            
            # Also update the latest backup
            latest_file = os.path.join(self.file_backup_dir, f"{backup_type}_latest.json")
            with open(latest_file, 'w', encoding='utf-8') as f:
                json.dump(content, f, indent=2, ensure_ascii=False)
            
            print(f"File backup successful: {filename}")
            return True
            
        except Exception as e:
            print(f"File backup error: {e}")
            return False
    

    
    def _restore_from_file(self, backup_type: str) -> Optional[Dict[str, Any]]:
        """Restore content from file backup"""
        try:
            latest_file = os.path.join(self.file_backup_dir, f"{backup_type}_latest.json")
            if os.path.exists(latest_file):
                with open(latest_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"File restore error: {e}")
        return None
    

    
    def list_backups(self) -> Dict[str, Any]:
        """List all available file backups"""
        backups = {
            'file_backups': []
        }
        
        # List file backups
        try:
            if os.path.exists(self.file_backup_dir):
                files = os.listdir(self.file_backup_dir)
                backups['file_backups'] = [f for f in files if f.endswith('.json')]
        except Exception as e:
            print(f"Error listing file backups: {e}")
        
        return backups

# Global backup manager instance
backup_manager = BackupManager()