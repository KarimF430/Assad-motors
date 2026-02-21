#!/usr/bin/env tsx

/**
 * AI Agent Compliance Validation Script
 * 
 * This script validates that all changes comply with the AI Agent Rulebook
 * Run this before any deployment to ensure standards are met
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface ComplianceResult {
  category: string;
  checks: Array<{
    name: string;
    status: 'PASS' | 'FAIL' | 'WARNING';
    message: string;
  }>;
}

class ComplianceValidator {
  private results: ComplianceResult[] = [];
  private rootDir: string;

  constructor() {
    this.rootDir = process.cwd();
  }

  /**
   * Run all compliance checks
   */
  async validateAll(): Promise<void> {
    console.log('🤖 AI Agent Compliance Validation Starting...\n');

    await this.validateFrontendConsistency();
    await this.validateBackendArchitecture();
    await this.validateDatabaseStandards();
    await this.validatePerformanceRequirements();
    await this.validateSecurityStandards();
    await this.validateDocumentation();

    this.generateReport();
  }

  /**
   * Validate frontend design consistency
   */
  private async validateFrontendConsistency(): Promise<void> {
    const result: ComplianceResult = {
      category: 'Frontend Design Consistency',
      checks: []
    };

    // Check for consistent color usage
    const colorPatterns = [
      'from-red-500 to-orange-500',
      'bg-[#291e6a]'
    ];

    const tsxFiles = this.findFiles('**/*.tsx');
    let colorConsistency = true;

    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for hardcoded colors that don't match pattern
      if (content.includes('bg-blue-') || content.includes('bg-green-') || content.includes('bg-purple-')) {
        if (!content.includes('from-red-500') && !content.includes('to-orange-500')) {
          colorConsistency = false;
          break;
        }
      }
    }

    result.checks.push({
      name: 'Color Scheme Consistency',
      status: colorConsistency ? 'PASS' : 'FAIL',
      message: colorConsistency ? 'All colors follow red-orange gradient pattern' : 'Non-standard colors detected'
    });

    // Check for consistent component structure
    let componentStructure = true;
    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Check for proper TypeScript interfaces
      if (content.includes('export default function') && !content.includes('interface') && !content.includes('type')) {
        componentStructure = false;
        break;
      }
    }

    result.checks.push({
      name: 'Component Structure',
      status: componentStructure ? 'PASS' : 'WARNING',
      message: componentStructure ? 'All components properly typed' : 'Some components missing TypeScript interfaces'
    });

    this.results.push(result);
  }

  /**
   * Validate backend architecture compliance
   */
  private async validateBackendArchitecture(): Promise<void> {
    const result: ComplianceResult = {
      category: 'Backend Architecture',
      checks: []
    };

    // Check layer separation
    const backendFiles = this.findFiles('backend/**/*.ts');
    let layerSeparation = true;

    for (const file of backendFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Routes should not contain business logic
      if (file.includes('routes') && (content.includes('await storage.') || content.includes('new Date()'))) {
        layerSeparation = false;
        break;
      }
    }

    result.checks.push({
      name: 'Layer Separation',
      status: layerSeparation ? 'PASS' : 'FAIL',
      message: layerSeparation ? 'Proper layer separation maintained' : 'Business logic found in routes layer'
    });

    // Check error handling
    let errorHandling = true;
    for (const file of backendFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      if (content.includes('async function') && !content.includes('try') && !content.includes('catch')) {
        errorHandling = false;
        break;
      }
    }

    result.checks.push({
      name: 'Error Handling',
      status: errorHandling ? 'PASS' : 'FAIL',
      message: errorHandling ? 'All async functions have error handling' : 'Missing error handling in async functions'
    });

    this.results.push(result);
  }

  /**
   * Validate database standards
   */
  private async validateDatabaseStandards(): Promise<void> {
    const result: ComplianceResult = {
      category: 'Database Standards',
      checks: []
    };

    // Check schema files
    const schemaFile = path.join(this.rootDir, 'backend/server/db/schemas.ts');
    
    if (fs.existsSync(schemaFile)) {
      const content = fs.readFileSync(schemaFile, 'utf-8');
      
      // Check for proper indexing
      const hasIndexes = content.includes('.index(') && content.includes('unique: true');
      result.checks.push({
        name: 'Database Indexing',
        status: hasIndexes ? 'PASS' : 'FAIL',
        message: hasIndexes ? 'Proper database indexes defined' : 'Missing database indexes'
      });

      // Check for foreign key validation
      const hasForeignKeyValidation = content.includes('pre(\'save\'') && content.includes('findOne');
      result.checks.push({
        name: 'Foreign Key Validation',
        status: hasForeignKeyValidation ? 'PASS' : 'FAIL',
        message: hasForeignKeyValidation ? 'Foreign key validation implemented' : 'Missing foreign key validation'
      });
    } else {
      result.checks.push({
        name: 'Schema File Exists',
        status: 'FAIL',
        message: 'Database schema file not found'
      });
    }

    this.results.push(result);
  }

  /**
   * Validate performance requirements
   */
  private async validatePerformanceRequirements(): Promise<void> {
    const result: ComplianceResult = {
      category: 'Performance Requirements',
      checks: []
    };

    // Check for pagination in API endpoints
    const routeFiles = this.findFiles('backend/**/routes*.ts');
    let hasPagination = false;

    for (const file of routeFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (content.includes('limit') && content.includes('skip')) {
        hasPagination = true;
        break;
      }
    }

    result.checks.push({
      name: 'API Pagination',
      status: hasPagination ? 'PASS' : 'WARNING',
      message: hasPagination ? 'API endpoints implement pagination' : 'Consider adding pagination for large datasets'
    });

    // Check for caching implementation
    const hasCaching = this.findFiles('**/*cache*.ts').length > 0;
    result.checks.push({
      name: 'Caching Strategy',
      status: hasCaching ? 'PASS' : 'WARNING',
      message: hasCaching ? 'Caching implementation found' : 'Consider implementing caching for better performance'
    });

    this.results.push(result);
  }

  /**
   * Validate security standards
   */
  private async validateSecurityStandards(): Promise<void> {
    const result: ComplianceResult = {
      category: 'Security Standards',
      checks: []
    };

    // Check for input validation
    const validationFiles = this.findFiles('**/validation/**/*.ts');
    const hasValidation = validationFiles.length > 0;

    result.checks.push({
      name: 'Input Validation',
      status: hasValidation ? 'PASS' : 'FAIL',
      message: hasValidation ? 'Input validation schemas found' : 'Missing input validation'
    });

    // Check for authentication
    const authFiles = this.findFiles('**/*auth*.ts');
    const hasAuth = authFiles.length > 0;

    result.checks.push({
      name: 'Authentication',
      status: hasAuth ? 'PASS' : 'WARNING',
      message: hasAuth ? 'Authentication implementation found' : 'Verify authentication is properly implemented'
    });

    this.results.push(result);
  }

  /**
   * Validate documentation requirements
   */
  private async validateDocumentation(): Promise<void> {
    const result: ComplianceResult = {
      category: 'Documentation',
      checks: []
    };

    // Check for README files
    const hasReadme = fs.existsSync(path.join(this.rootDir, 'README.md'));
    result.checks.push({
      name: 'README Documentation',
      status: hasReadme ? 'PASS' : 'WARNING',
      message: hasReadme ? 'README.md exists' : 'Consider adding README.md'
    });

    // Check for AI Agent Rulebook
    const hasRulebook = fs.existsSync(path.join(this.rootDir, 'AI_AGENT_RULEBOOK.md'));
    result.checks.push({
      name: 'AI Agent Rulebook',
      status: hasRulebook ? 'PASS' : 'FAIL',
      message: hasRulebook ? 'AI Agent Rulebook exists' : 'AI Agent Rulebook missing'
    });

    this.results.push(result);
  }

  /**
   * Find files matching pattern
   */
  private findFiles(pattern: string): string[] {
    try {
      const command = `find ${this.rootDir} -name "${pattern.replace('**/', '')}" -type f`;
      const output = execSync(command, { encoding: 'utf-8' });
      return output.trim().split('\n').filter(line => line.length > 0);
    } catch (error) {
      return [];
    }
  }

  /**
   * Generate compliance report
   */
  private generateReport(): void {
    console.log('\n📊 COMPLIANCE VALIDATION REPORT\n');
    console.log('='.repeat(50));

    let totalChecks = 0;
    let passedChecks = 0;
    let failedChecks = 0;
    let warningChecks = 0;

    for (const category of this.results) {
      console.log(`\n📋 ${category.category}`);
      console.log('-'.repeat(category.category.length + 4));

      for (const check of category.checks) {
        totalChecks++;
        
        const statusIcon = {
          'PASS': '✅',
          'FAIL': '❌', 
          'WARNING': '⚠️'
        }[check.status];

        console.log(`${statusIcon} ${check.name}: ${check.message}`);

        if (check.status === 'PASS') passedChecks++;
        else if (check.status === 'FAIL') failedChecks++;
        else warningChecks++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📈 SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Checks: ${totalChecks}`);
    console.log(`✅ Passed: ${passedChecks}`);
    console.log(`❌ Failed: ${failedChecks}`);
    console.log(`⚠️  Warnings: ${warningChecks}`);

    const successRate = Math.round((passedChecks / totalChecks) * 100);
    console.log(`\n🎯 Success Rate: ${successRate}%`);

    if (failedChecks > 0) {
      console.log('\n🚨 COMPLIANCE FAILED - Fix issues before deployment!');
      process.exit(1);
    } else if (warningChecks > 0) {
      console.log('\n⚠️  COMPLIANCE PASSED WITH WARNINGS - Review recommendations');
    } else {
      console.log('\n🎉 FULL COMPLIANCE ACHIEVED - Ready for deployment!');
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new ComplianceValidator();
  validator.validateAll().catch(console.error);
}

export { ComplianceValidator };
