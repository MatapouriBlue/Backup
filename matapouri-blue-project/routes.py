import os
from flask import render_template, send_from_directory, request, redirect, url_for, jsonify
from app import app

@app.route('/')
def index():
    """Main homepage with image carousel"""
    # Load philosophy content from file
    import json
    
    philosophy_data = {
        'title': 'Our name, our philosophy',
        'text1': 'Inspired by the philosophy of Japanese Bonsai, the Matapouri Blue Totara found on our land, and the deep blue of the lake, our name and place reflect the values we hold dear.',
        'text2': 'Life isn\'t always easy—but with strong roots, a sense of direction, and the courage to shape new growth, we believe each person can define their own path and future.'
    }
    
    if os.path.exists('static/philosophy_content.json'):
        try:
            with open('static/philosophy_content.json', 'r') as f:
                philosophy_data = json.load(f)
        except:
            pass
    
    return render_template('index.html', 
                         thunderforest_api_key=os.environ.get('THUNDERFOREST_API_KEY'),
                         philosophy=philosophy_data)

@app.route('/about')
def about():
    """About page with sub-sections"""
    return render_template('about.html')

@app.route('/about/unique-holiday-experience')
def unique_holiday_experience():
    """A unique holiday experience page"""
    return render_template('about/unique_holiday_experience.html')

@app.route('/about/accommodation-and-facilities')
def accommodation_and_facilities():
    """Accommodation and facilities page"""
    return render_template('about/accommodation_and_facilities.html')

@app.route('/about/discover-kinloch')
def discover_kinloch():
    """Discover Kinloch page"""
    return render_template('about/discover_kinloch.html')

@app.route('/about/your-hosts')
def your_hosts():
    """Your Hosts page"""
    return render_template('about/your_hosts.html')

@app.route('/about/room-rates')
def room_rates():
    """Room Rates page"""
    return render_template('about/room_rates.html')

@app.route('/about/booking-times')
def booking_times():
    """Booking Times page"""
    return render_template('about/booking_times.html')

@app.route('/about/cancellation-policy')
def cancellation_policy():
    """Cancellation Policy 100% refund page"""
    return render_template('about/cancellation_policy.html')

@app.route('/about/transport')
def transport():
    """Transport / Pick up & Drop off page"""
    return render_template('about/transport.html')

@app.route('/about/respite-studio-guidelines')
def respite_studio_guidelines():
    """Respite Studio Guidelines page"""
    return render_template('about/respite_studio_guidelines.html')

@app.route('/how-to-book')
def how_to_book():
    """How to book page"""
    return render_template('how_to_book.html')

@app.route('/check-availability')
def check_availability():
    """Check availability page"""
    return render_template('check_availability.html')

@app.route('/discover')
def discover():
    """Discover page"""
    return render_template('discover.html', thunderforest_api_key=os.environ.get('THUNDERFOREST_API_KEY'))

@app.route('/contact')
def contact():
    """Contact page"""
    return render_template('contact.html')

@app.route('/text-editor')
def text_editor():
    """Text editor for positioning elements"""
    return render_template('text_editor.html')

@app.route('/standalone-text-editor')
def standalone_text_editor():
    """Standalone text editor for integration into other projects"""
    return send_from_directory('.', 'standalone_text_editor.html')

@app.route('/aarons-word-processor')
def aarons_word_processor():
    """AARONS WORD PROCESSOR - Dedicated text editor project"""
    return send_from_directory('.', 'aarons_word_processor.html')

@app.route('/simple-text-editor')
def simple_text_editor():
    """Simple text editor route"""
    return send_from_directory('.', 'simple_text_editor.html')

@app.route('/philosophy-text-editor')
def philosophy_text_editor():
    """Philosophy text editor"""
    return send_from_directory('.', 'philosophy_editor.html')

@app.route('/save-philosophy', methods=['POST'])
def save_philosophy():
    """Save philosophy text to JSON file and backup to Supabase"""
    try:
        data = request.json
        
        # Save to JSON file (local storage)
        with open('static/philosophy_content.json', 'w') as f:
            json.dump(data, f, indent=2)
        
        # Create backup
        from backup_system import backup_manager
        backup_success = backup_manager.backup_philosophy_content(
            title=data.get('title', ''),
            text1=data.get('text1', ''),
            text2=data.get('text2', '')
        )
        
        result = {'success': True}
        if backup_success:
            result['backup'] = 'Content backed up to file successfully'
        else:
            result['backup'] = 'Content saved locally (backup failed)'
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/backup-dashboard')
def backup_dashboard():
    """File backup management dashboard"""
    from backup_system import backup_manager
    backups = backup_manager.list_backups()
    
    return render_template('backup_dashboard.html', 
                         backups=backups)

@app.route('/create-backup', methods=['POST'])
def create_backup():
    """Create a full project backup"""
    try:
        from backup_system import backup_manager
        success = backup_manager.backup_project_files()
        
        if success:
            return jsonify({'success': True, 'message': 'Project backup created successfully'})
        else:
            return jsonify({'success': False, 'error': 'Backup creation failed'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/download-project')
def download_project():
    """Download project as zip file for GitHub upload"""
    import zipfile
    import tempfile
    from flask import send_file
    
    try:
        # Create temporary zip file
        temp_dir = tempfile.mkdtemp()
        zip_path = os.path.join(temp_dir, 'matapouri-blue-project.zip')
        
        # Files to include in zip
        files_to_zip = [
            'app.py', 'routes.py', 'backup_system.py', 'main.py',
            'vercel.json', 'pyproject.toml', 'uv.lock',
            'static/css/style.css', 'static/philosophy_content.json',
            'static/js/carousel.js', 'static/js/kinloch-map.js',
            'templates/base.html', 'templates/index.html', 'templates/discover.html',
            'templates/about.html', 'templates/how_to_book.html', 'templates/check_availability.html',
            'templates/contact.html', 'templates/backup_dashboard.html',
            'aarons_word_processor.html', 'philosophy_editor.html',
            'standalone_text_editor.html', 'simple_text_editor.html',
            'text_editor.html', 'text_editor_integration_guide.md'
        ]
        
        # Add backup files
        if os.path.exists('backups'):
            for file in os.listdir('backups'):
                if file.endswith('.json'):
                    files_to_zip.append(f'backups/{file}')
        
        # Add attached assets (sample)
        asset_samples = [
            'attached_assets/Garden_1752715224980.jpeg',
            'attached_assets/Blue heron_1752719468329.jpeg',
            'attached_assets/Lounge studio_1752715224981.jpeg'
        ]
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in files_to_zip:
                if os.path.exists(file_path):
                    zipf.write(file_path, file_path)
            
            # Add sample assets
            for asset in asset_samples:
                if os.path.exists(asset):
                    zipf.write(asset, asset)
        
        return send_file(zip_path, as_attachment=True, download_name='matapouri-blue-project.zip')
        
    except Exception as e:
        return f"Error creating zip: {e}", 500

@app.route('/push-to-github', methods=['POST'])
def push_to_github():
    """Push project changes to GitHub automatically"""
    import subprocess
    import tempfile
    import shutil
    from datetime import datetime
    
    try:
        github_token = os.environ.get('GITHUB_TOKEN')
        if not github_token:
            return jsonify({'success': False, 'error': 'GitHub token not found'})
        
        repo_url = f"https://{github_token}@github.com/MatapouriBlue/Backup.git"
        
        # Create temporary directory for git operations
        temp_dir = tempfile.mkdtemp()
        
        try:
            # Clone repository to temp directory
            subprocess.run(['git', 'clone', repo_url, temp_dir], 
                         capture_output=True, text=True, check=True)
            
            # Copy current files to cloned repo (excluding .git)
            files_to_copy = [
                'app.py', 'routes.py', 'backup_system.py', 'main.py',
                'vercel.json', 'static/', 'templates/', 'backups/',
                'aarons_word_processor.html', 'philosophy_editor.html'
            ]
            
            for item in files_to_copy:
                if os.path.exists(item):
                    dest_path = os.path.join(temp_dir, item)
                    if os.path.isdir(item):
                        if os.path.exists(dest_path):
                            shutil.rmtree(dest_path)
                        shutil.copytree(item, dest_path)
                    else:
                        shutil.copy2(item, dest_path)
            
            # Git operations in temp directory
            os.chdir(temp_dir)
            
            # Configure git user (required for commits)
            subprocess.run(['git', 'config', 'user.name', 'Aaron Goodwin'], check=True)
            subprocess.run(['git', 'config', 'user.email', '45010029-matapouriblue@users.noreply.replit.com'], check=True)
            
            subprocess.run(['git', 'add', '.'], check=True)
            
            # Check if there are changes to commit
            result = subprocess.run(['git', 'status', '--porcelain'], 
                                  capture_output=True, text=True)
            
            if result.stdout.strip():
                # Commit and push changes
                subprocess.run(['git', 'commit', '-m', 
                              f'Updated Matapouri Blue website - {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}'], 
                             check=True)
                subprocess.run(['git', 'push', 'origin', 'main'], check=True)
                
                return jsonify({
                    'success': True, 
                    'message': 'Project successfully pushed to GitHub!',
                    'repo': 'https://github.com/MatapouriBlue/Backup'
                })
            else:
                return jsonify({
                    'success': True, 
                    'message': 'No changes to push - repository is up to date'
                })
                
        finally:
            # Clean up temp directory
            os.chdir('/home/runner/workspace')
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
                
    except subprocess.CalledProcessError as e:
        return jsonify({'success': False, 'error': f'Git operation failed: {e}'})
    except Exception as e:
        return jsonify({'success': False, 'error': f'Push failed: {e}'})

@app.route('/apply-css', methods=['POST'])
def apply_css():
    """Apply CSS changes to the website"""
    try:
        css_content = request.json.get('css', '')
        if css_content:
            # Write CSS to a temp file or apply directly
            with open('static/css/text_editor_generated.css', 'w') as f:
                f.write(css_content)
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'No CSS content provided'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/apply-philosophy-text', methods=['POST'])
def apply_philosophy_text():
    """Apply text content changes to philosophy section"""
    try:
        data = request.json
        title = data.get('title', '')
        text1 = data.get('text1', '')
        text2 = data.get('text2', '')
        
        # Store the changes in session or database
        # For now, we'll use a simple file-based approach
        import json
        philosophy_data = {
            'title': title,
            'text1': text1,
            'text2': text2
        }
        
        with open('static/philosophy_content.json', 'w') as f:
            json.dump(philosophy_data, f)
            
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return render_template('index.html'), 500
