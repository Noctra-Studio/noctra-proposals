const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // First revert .from('contracts' as any) back to .from('contracts')
  content = content.replace(/\.from\(['"]contracts['"](?:\s*as\s+any)?\)/g, ".from('contracts')");
  // Also revert proposal_history
  content = content.replace(/\.from\(['"]proposal_history['"](?:\s*as\s+any)?\)/g, ".from('proposal_history')");
  
  // Now we don't even need to use `as any` because `proposal_history` is in Database,
  // AND `contracts` is in Database. 
  // Let's just write back the clean `from('contracts')` everywhere.
  
  if (content !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Reverted ' + file);
  }
}
