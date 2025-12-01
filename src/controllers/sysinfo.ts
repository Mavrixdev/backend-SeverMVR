import { exec } from 'child_process';
import os from 'os';
import { promisify } from 'util';
import { Logger } from '../utils/logger';
import { ResponseHandler } from '../utils/response';

const execAsync = promisify(exec);

interface SystemInfo {
  os: {
    platform: string;
    arch: string;
    release: string;
    version?: string;
    hostname: string;
    uptime: number;
    uptimeFormatted: string;
  };
  cpu: {
    count: number;
    model: string;
    speed: number;
    usage: number;
  };
  memory: {
    total: number;
    totalGb: number;
    used: number;
    usedGb: number;
    free: number;
    freeGb: number;
    usagePercent: number;
  };
  load: {
    avg1: number;
    avg5: number;
    avg15: number;
  };
  disk?: {
    usage: string;
  };
  network: {
    interfaces: number;
    addresses: Array<{
      family: string;
      address: string;
      interface: string;
    }>;
  };
  timestamp: string;
}

class SysInfoController {
  static formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);

    return parts.join(' ') || '0s';
  }

  static formatBytes(bytes: number): number {
    return Math.round((bytes / (1024 * 1024 * 1024)) * 100) / 100;
  }

  static async getDiskUsage(): Promise<string | null> {
    try {
      const platform = os.platform();
      let command = '';

      if (platform === 'win32') {
        command = 'wmic logicaldisk get name,size,freespace';
      } else {
        command = 'df -h / | tail -1';
      }

      const { stdout } = await execAsync(command);
      return stdout.trim();
    } catch (error) {
      Logger.error('Error getting disk usage:', error);
      return null;
    }
  }

  static getNetworkInfo(): Array<{ family: string; address: string; interface: string }> {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const [name, nets] of Object.entries(interfaces)) {
      if (nets) {
        for (const net of nets) {
          if (net.family === 'IPv4' || net.family === 'IPv6') {
            addresses.push({
              family: net.family,
              address: net.address,
              interface: name,
            });
          }
        }
      }
    }

    return addresses;
  }

  static async getSystemInfo(): Promise<SystemInfo> {
    const platform = os.platform();
    const arch = os.arch();
    const release = os.release();
    const hostname = os.hostname();
    const uptime = os.uptime();
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const loadAvg = os.loadavg();
    const networkInterfaces = os.networkInterfaces();
    const diskUsage = await this.getDiskUsage();
    const networkInfo = this.getNetworkInfo();

    return {
      os: {
        platform,
        arch,
        release,
        version: `${platform} ${release}`,
        hostname,
        uptime,
        uptimeFormatted: this.formatUptime(uptime),
      },
      cpu: {
        count: cpus.length,
        model: cpus[0]?.model || 'Unknown',
        speed: cpus[0]?.speed || 0,
        usage: Math.round(((cpus.length - 1) / cpus.length) * 100 * 10) / 10,
      },
      memory: {
        total: totalMem,
        totalGb: this.formatBytes(totalMem),
        used: usedMem,
        usedGb: this.formatBytes(usedMem),
        free: freeMem,
        freeGb: this.formatBytes(freeMem),
        usagePercent: Math.round((usedMem / totalMem) * 100 * 10) / 10,
      },
      load: {
        avg1: loadAvg[0],
        avg5: loadAvg[1],
        avg15: loadAvg[2],
      },
      disk: diskUsage ? { usage: diskUsage } : undefined,
      network: {
        interfaces: Object.keys(networkInterfaces).length,
        addresses: networkInfo,
      },
      timestamp: new Date().toISOString(),
    };
  }

  static async handle(_req: any, res: any) {
    try {
      const systemInfo = await this.getSystemInfo();
      return ResponseHandler.success(res, systemInfo, 'System information retrieved successfully');
    } catch (error) {
      Logger.error('Error fetching system info:', error);
      return ResponseHandler.error(res, 'Failed to fetch system information', 500);
    }
  }
}

export default SysInfoController;
