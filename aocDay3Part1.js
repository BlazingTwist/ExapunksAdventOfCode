// For the latest Axiom VirtualNetwork+ scripting documentation,
// please visit: http://www.zachtronics.com/virtualnetwork/
// noinspection DuplicatedCode

function getTitle() {
    return "Day 3.1 : Rucksack Reorganization";
}

function getSubtitle() {
    return "Advent of Code 2022";
}

function getDescription() {
    return ""
        + "Find the problem description here https://adventofcode.com/2022/day/3\n"
        + "The Quartermaster resides in Tent5 (Link 805), he stored all of the backpacks in File 200, prefixed by their size."
        + " Also, backpacks are stored as the ASCII codes of their characters. [A = 65, Z = 90] and [a = 97, z = 122].\n"
        + " For example: the backpacks ['ab', 'c'] are stored as [2, 97, 98, 1, 99].\n"
        + "You are required to report the priority-sum of all misplaced items to the Head of Logistics in Tent1 (Link 801, #LOGI) "
        + "You are guaranteed that the sum is in range [0, 9999], no preprocessing needed."
        ;
}

let currentTestRun = -1;
let rawBackpackData = null;
let backpackData = [];
let expectedResult = 0;

function initializeTestRun(testRun) {
    let recompute = currentTestRun !== testRun;
    currentTestRun = testRun;

    if (recompute) {
        rawBackpackData = getRawBackpackData(testRun);
        backpackData = rawDataToBackpackFile(rawBackpackData);
        expectedResult = getExpectedResult(rawBackpackData);
    }

    let beachHost = createHost("Beach", 5, -1, 5, 5);
    let pathHost = createHost("path", 12, 1, 8, 1);
    let tents = [
        createHost("Tent1", 12, 4, 1, 2),
        createHost("Tent2", 14, 4, 1, 2),
        createHost("Tent3", 16, 4, 1, 2),
        createHost("Tent4", 18, 4, 1, 2),
        createHost("Tent5", 12, -3, 1, 2),
        createHost("Tent6", 14, -3, 1, 2),
        createHost("Tent7", 16, -3, 1, 2),
        createHost("Tent8", 18, -3, 1, 2),
    ]
    createLink(beachHost, 800, pathHost, -1);
    for (let tentID in tents) {
        createLink(pathHost, 801 + parseInt(tentID), tents[tentID], -1);
    }

    let logisticsTent = tents[0];
    let logisticsGoal = requireCustomGoal("Report priority-sum to Head of Logistics.");
    let logisticsRegister = createRegister(logisticsTent, 12, 5, "LOGI");
    let logisticsTerminal = createWindow("Logistics Terminal", 0, 7, 40, 2);
    printWindow(logisticsTerminal, "Awaiting sum of priority scores...");
    printWindow(logisticsTerminal, "Expected sum: " + expectedResult);
    let logiInputReceived = false;
    setRegisterWriteCallback(logisticsRegister, function (input) {
        if (logiInputReceived) {
            return;
        }
        logiInputReceived = true;

        clearWindow(logisticsTerminal);
        if (input === expectedResult) {
            printWindow(logisticsTerminal, "That is correct!");
            setCustomGoalCompleted(logisticsGoal);
        } else {
            printWindow(logisticsTerminal, "Expected: " + expectedResult);
            printWindow(logisticsTerminal, "But Got : " + input);
            setCustomGoalFailed(logisticsGoal);
        }
    })

    let quartermasterTent = tents[4];
    let backpackFile = createLockedFile(quartermasterTent, 200, FILE_ICON_ARCHIVE, backpackData);
    if (testRun > 2) {
        setFileInitiallyCollapsed(backpackFile);
    }
}

function onCycleFinished() {
}

const sampleCases1 = ["vJrwpWtwJgWrhcsFMMfFFhFp", "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL", "PmmdzqPrVvPwwTWBwg", "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn", "ttgJtRGJQctTZtZT", "CrZsJsPPZsGzwwsLwLmpwMDw"];
const sampleCases2 = ["NGvdqJmJvpNbGRMGQgRsfgfn", "WlHTHShlLwSWjFRsncfbcwsgQc", "BHtSBHWHSCWLZHlhjTHLLdbNNqNpzpDzNvDvtPmmPp", "JJSShnTpDSJJlllfwBNVbMQWwhQhgQtt", "cTzrvrHdLwwzttQNWB", "qrFqTFvqZvrmsplsjlnDflnZ", "mhhhVHvNNddHMwBqQwlWZZtv", "fbjzjJllCtWjjrZtjq", "CbgcgpPRDJfzVHFFnSnsSDlm", "ZqBPqBQnPLmqZsFqhsvFsLZQMfSSMbbWddWbjbJSrgWgJf", "NRHnlllcDwwCNClNtttHbNJrSJNfbdWMdfbWgdrJ", "cHGlzTptHtCpncHnCpHpRGzDmvVhqLmvLPmPvLqPmzsqqmPB", "rCzVtMMbMvCmmvGlclFQFfLpJFJfJpcLHPJL", "nDGGwqGqnRTfpHLpRFpLFf", "ZNdNTDsWgNZsZBndnGrzrlMrjgrmjVGjvC", "MgFZHFTgqFFDZZDTdVdHrzQvLzCGwpCPrGLqQpzz", "JsnmbjhmffJbRNJppzPPzwzzrwdv", "lfblfthBRbBRjnjhBtBlZgdVcFSTVFDtSSWgMcdM", "hPVhVhWPCMhlDTTWdrPlTcLjfbZbFNjZBbFNBbdBFbsB", "MHSwMJpHnqJHwtqHGqGGmvqZsZFjBmsBNRBFfLbsFsZfsZ", "pqtMHHQpvqnwMpgJMCChTQhVVlclPWrCCD", "zRBBhZFwWZlBQpMZNNNJsfDpLsNsJppN", "SvggPbjvVSvvtgGVPbbnSMcCLtMrDddssJdsLdfdCD", "mTSmMgHjgmgGgqzTwZwBlBFzwB", "WLzWZHWSZPFRVSPSPM", "hmrvmGvfTCmhBGBqTfnmJFfdbQcwdMhMwRdbQMVQQcMhsQ", "JGJJnrnnCmqBTJTrNBqBLDzHFLFDNgjZlWtDNZHL", "bwbbnWwpbTwFHwRzzzmH", "ZccjZjddjPVhJmrBQHHFQRHcWF", "NVhWldsMjZZZLSnvSTGTgvMb", "ccJbHpzccZJsNpJCmHHlBTgHnlTPmF", "qvQGQfDVhhDfvVfVDSdDCbFnjmllPQjlbCmnFgjg", "hSbtWRGvhdfDVdVRfvRNpsWsZLNMZzcswLZWMM", "vlTdlBTMdtjcvLGmtb", "SSgfSsJngCSSwNFgspHFNFFpjlbGjQbbQGLthLnWtmWWhjbm", "SJsfqqgfNHwJfHgCpwzBZVMDBPMMRPTlqzBr", "VHsVhtbRHRpVHBfBCJdNfGjggGJdqLGq", "wSzSrrSMPDSDwzPjdqJjNwGdsLqGjj", "MnrnQTnWZWWzWQDMvZhtHtshhHlHBcBBsvVt", "DZbPqdTqGTZtRrzjFmZZtF", "gjQwVvBVWgfghvgmcrBNFccHFRmHtF", "QlgvWlfgVsQfdlqqjqPDbPlM", "VcfLwwcMlpnfVDrDtrtvbjMtTM", "mmgBgzSQmQdgHBFSLvvbDTJmTDvTJJDr", "RWNBHHzWNSdSdzFgSLNWWfZGwfpcwWVnnfpCCWlV", "GDZLtsJMFGLDPnbblJlNJNcJ", "BBRgSwqwqRZhTVSqjVgRwCdQcmcPmdnPPnPnmjlrbmQj", "RCqfVvhfCCShBCRfVCwztDGZMHpLWHftFptspF", "dlZqlBfBSShZhvprbCJTDrJCJjJNDh", "WGRwQwHsMVVGMsVGcRVtQWRVpNCjWNDbzbDNJnbnrCbprrNW", "HgHRRVGGwLgLBPvgSp", "QPlZSlZzVLLDwhDfBppf", "bghGGhmqrspDcfbsbs", "tTrdTgFddtnvmdgvtCTdGTTqFZjjQQPVZPSZSjlZhVVQjlRS", "BgBFHnwwSTNHqSPN", "GJmCbDdlbZGCLhsstNLsMZZZ", "JGJpCCDvmlVDVldGJBVfBBRwRjnVWWBRfN", "WTFWQgGQtTMqMCJJzDVDgCchhj", "mNPBmPlPHrWmwmNLHmShcnJjhrnzJzdcdzdjJJ", "SHssNRSmvPRmlsmLwwsmwLvpQptpQWMQbGFQFtfpFfZQ", "DgpNLVjgNjjmzGPVRmfrZrctdTcrzfwzdfMc", "bnbNqnbFNwMcMtMfwF", "svCQHHhShnbCvHChsvHlLDVhJJLRJGNpgPJPjLLD", "TmBzgTVVBgfbmTVfPmFRJcHctnHDLDDLJqqBGB", "hwvlNCCvSphMwSvrlwCCrrDcfRlJDLRtGqcqHnqRqLGR", "pMSSMMNCSwMjjWhwrrjShQNFmsPmPFWbbZzVfZsPPPZVmZ", "sTTrWGCMggpVWhSBltWp", "HNJdwLDzNcJnNLwJJPqpllqhBpqStjfwlfpj", "PJHzDzFLtLccdLggvrGGmgvFssgG", "FwCssBFRBlvbBVdQ", "jPzjDpqNGqJzZGSNHppPclFvvdfVflblbJlmFfll", "SDzDpSNqjZjjZFSrHrFZTTCMLsnTLnnnMhrLtLnn", "ScWQvvSDddGrWVrG", "fwhPFLpwTfTjrzwHdmmmGdgdsPsqdRmV", "CHlFpTpwwCjwFjwjCBnrvQBZZcBSnZtvZl", "vJvdWVNslWtJcDtDHrDf", "GCnnMZpZnSZpvDqFtftfjfZqrh", "TbGMSRCRvWbPNsWB", "NNNdsRddGNdZZTCBtqbtBgtC", "zhFHppHhzcgmzQhccjgmjhQTnvvBFtBnCBbbnTvtCCtntt", "HpjmhfSjQwfzwHmcggfzjSLfVWPDsWMsMdWdDSMsGWPPllVN", "WSvcSSwrGzFsznqPNNWqPqlllB", "djVDdHdSPRqlntjN", "LpZZgpLgLHTDHVpDSTsffvGwrcfffGwv", "wGlbWGVvGlWlrvppbFMjQjsBjCsjmCzzQzNv", "ZgfdJcfZhMNCgSBRCQRz", "hcLDZPZdqZhJPhcTHJfPHVqlqtFWMrGGrpwVGVpWrV", "dsngCgdssHDVsHdsFDvMDvmMmjTjDFTL", "qZpSqptZZGWLTLSjlLHFzl", "NZqqRpWqhQpNhqhpZRWBJQQssJbbCsdbHsCbgb", "QdGBjjbHsBsBbBdGcwwTGrCRRrFcPPTC", "ZDtvWfMDvWScSrpzPccCdr", "hhZMgffDhZNvtDgHQsQQVQmBVVHNdV", "LhQLrzVdVmqcjmTNzm", "tHMZDJDZCDDtZMWwCJjcffqqfjRmqSRqcq", "CpHpZZWWtWpWwBplZWmQbhVBVPhnPrhbLQPvvs", "FFgFSmJmSgGpZzsmgGmbDlDzMQPDNPzRQRDjQQzV", "CLwnwWBdrtthttTWBWdPnVvRVVVNMSVQPvVnnV", "BTtdLthfhTrLdftCwqrddmGFcSfpGbsmFGHpmGFHHc", "JFJnMZwQBqnJJBqZJqPqMFBlbmBHblWbrmlfbWgbvmWrgW", "spCTjtVzsNDdsNdTsjVTtNzgHfmWWgHSSrgrbSbbhHbVHS", "TfCdjjsjzLNsfTszcdqcQMnRMPPRnFRPQRFP", "VvDgDqTDtTNWTWfNFWlW", "pzPvdssRNQFQRNZF", "CCpBpsrrccGvttgGqBDG", "jmZrrjlCJqmCVFMPbFbBZPVp", "dfLLfRMGTdHbssPLLPbFwL", "QWWHHTRQdRRHRMhzWQfvddngqJqjjNgqqjlgvrtjJmtn", "sGGwJdHDDTfWbTcRzbbz", "BmjvdhNVlFBZmSZvFrWpfpcBrbzbWcbqpf", "SLmSZLhNhMhwtLswPHGssd", "mGhlPclTmhhlJRWlRTDPlJtTFMngBcLSBHHBHLHSwncFgLwB", "jQVbjprjVfzbZQrzdGnHrrBLgSGwGFLHHg", "zzZqjQjdvsRlGqThGJ", "GSPQPvVmSwpVQGVlSQmWJRcFBpnFBcBWcJcJDc", "rTTCLmhTTbZNqMNbhjfhmDzsFDWzsDnfcBWDDDzcFs", "qmjhrhCtbMCZNhZMhNTZbLjvQdHdHGgwgdtQHlllQwlQgv", "ggpCCgvjPTJWjBjWWJgCWCdVVHRZdLfZhqLdZRHZrf", "GsstmNslzzzGlMnGMnVZRZrLpZqdhZHZrZHM", "lNbDsbltmzpsmmmnnccBJTwPgWvvvTwPwFPS", "FWbTRTdWGCnThqQVBQqJ", "rrDMPrDcSrvtcJdLVhVHQMQVBQ", "rNtNwrZtDNPmZStwvcvRlGFRlzCRlpmdpplbpb", "gHrHrlFgjCrNDfCMTzwwLN", "WhvTvvWnmQvpGWNNLzwWfNzW", "vTnRZhnRRBhscBVpcBTvnsjFltPqggqHPHHjHrPcgrFg", "VzfWRVsnNzWfsvpQPvvFbdVQpQ", "SqCqqhLDTTCTTCDcSdbpPvdPFFvhMbdMvF", "BCLBDCDGLlTClCSrglrGzWmrszzmHRJmfJfJpHNz", "dwGBHGdwdcCMCBzzZJJssZFsBBgt", "NRqbRbQhLQRLrQlTggFWlZtRlTvW", "FbNDFDLqnmLmNbqbLQbhLNDpPcVHMSVMwCVHcPnVGccwjdcM", "LdHtrrrHrLZrBVbQjtPnnsVb", "TwfhhcTCTCpfJJwpTJwhDDPnbGsbFjlQnnQjFBFslsBQDl", "pwJCThfRCMMMvhchhwHSmWLZHLNHMdrdZzPg", "LbMQbHbHQLLMsWLvszvzvqCfqCCqss", "ScWlpmplWrDzlzvznJ", "RNNcZWhSZmdVdPwHbQQTTwNwjP", "jFFFtHZjwmLNmnQCFL", "sVbdsqcqHBHqrQrLPmWqQnmr", "sfGJVVzJJsczczfsczBzzvdbTMTptlTZZgDSDtGlplZSlgHt", "MgMQJdqqMDQJDggzTMgVplvffmctcCzmfjRlmmmjjR", "HrGbGswnBBtRvccBlljB", "HZPHRRGGshZHnnnwPnshnVZqMJJDdpQDVgDdVDWDpQ", "whwQRQGHRVhWRRcLLJgLmL", "jSnnzgBnpCZdCBjNmnNNJmllJTlccT", "jPSzrzpzpCjgfZZrZCFpdwQDQVVPttGDtVqQVtHqth", "mvnGFmvGhTcSCBcBpv", "bwMRzbQLwBQRWSctCcTtLpss", "JJgHZqRrbqDnmBjhDh", "MVvvGrsbGtVsgTggHjSFHJBBBg", "PPNpCpQPZppplttDNwZPBdfTFPPTSBWSFjjSTH", "CpNwChQCzDDNZwhZlpwZpqrqsGGsmmctGbbbzcmMms", "pjMbgCgdQjCgBjQQCncwcGGLDZvFtGLsZZFZtH", "zPhhrVhVVSmqVqhmzPqvDtsLLHrFWFvGFGFsvt", "SVPzVTzJNBfjDQbQTb", "CRDjjRmmLhjRFFChmHDNLZzsZNnPZNzlnnsvlv", "SSqcMwdrctQVtqTwSSgnvZnsZvnBZpcPsvlvbz", "trMGSSVdQQqdGMtwwQCmRHHhmJFhsfJGfjHh", "phJzrnJJwNNSJhSnwpwGGZzmvNfmmDvfcvcDfvbRPNcvvR", "tWtgQBqsqdLFLmZvTRTfDZcb", "ttssdgQqsHQtZFsqVdgdgdCBJGSphnljnJhjwrhnpJrrzJHl", "srzpVWrWTptbrPpPPtcWpNhNNNdfhhDgDNvfBDNNds", "jmnQHmLqlnSlGMjqnLLljRHqdNdgwHZBgfhZvBdNhDwBhhtZ", "MjSlnLmMLnCGjlSQLVWCzbrcTpPtpFbFWr", "ZnQRczHZsMSRZQcBRSZRscQwJbWFbbQwpWTjdFLJTJTWwd", "PVmGqDlGhDPVNvqDmmqtqLbbpJfFJwpbdJpdbfdjwdbl", "VGNCgGPgqVqhNvmNCNZnSsRLRsMzzgBRnHrS", "ZgMMgJMhjmZrZgggmlTTbfwTfRfbRGwlGTDf", "nPqQttNVPzSPnqpGDwDDbGfwbJ", "dJvQzzJtdSPWSthhHMjgMvrHghsv", "cMvwHCWcMnwWnScWVFzTqHpHFpVBFtFp", "bbblgRDhtlGgRPFBRqFpmzVFBTFp", "fPbtGJGhfDfDsPhQJDPbbnjjSWnwjdvQCnSSCnCSCM", "NcgDtwghTLntgNtLrjfHSSFlSbCfprlL", "ZGGMmdmVZVvsRQvMGRVVZCHPfpZSfZbFPlbPjCfH", "RVRjvRzMQQJBVmzzgWgzTWTWhNcWzN", "gsgBqdsWprWddpBghBpwwJzbLcvhCZmwZCFcJC", "PRPtStHfwmJvzPmF", "HnSHHRQDVFsVVgsgTWsG", "QRQTRrDHSLSNzzZLzZ", "dBmPwfwffWtWRtzdhhLzLzLzzLFN", "BtWnWCCVBWtCBmRPqVmqmntjjlJHJslJQVsQjsbbHrjHDQ", "TwwJrHSMnHGvWHMvvSqrrZbRrRqfqVNfbNRc", "GjhstmPFFhlFtmmjQtlgVcZVfcgqqNRNpgRcbP", "CzdCdFCtdzGWGJwWWHdW", "zfSVfSpHVpCHSZLnsttDnvDvpcsqRc", "rWzMGWFFPBFjqjDjFDFs", "PbQQWbJPrQwPrrPBwrJCVzZZLZdLSLLmfZfHJd", "gPDPLgsLNslNLHqlLqqjhjnwwjJbDjnjwTRnGD", "tzdMdMddmcRMdtcFFGWnwWjFwjFhGbTG", "mRMmttpVHNCNpNZN", "mfCFGfDDFCDWtvvstjjJ", "njnVnrggLlwVVqLpvHVpMpMsHVhhMW", "QQPPPnjlPPSgwBrnNLcdFCNNGFbmbZFcZzFf", "NzNHFNFnFrtgwwPchvGFFS", "LsjdQCVsTsLCTTdMCJtQgPPqwhPgqScPGvSZ", "jdLdVjJtCVjRCMpmpNfNNWHrNzDrNrHrmr", "NmggPPrPbPmdCbcfCNLVRRWpWTWRVTpdVVWspW", "qGhDzGqnwGQnJrjllJWttMRDFRtMVsTDTTZs", "SrnHhGQlvLmSfbfc", "DmdPCJMLlQdSjGCqjcGGccHH", "zWtBwfsgvVnBfftWtnnpTmnTRhppHpTqpc", "wzFtwZWmsVFzZtvPJSPbMFJFDJJJJd", "wrPRRSJSWrTSRzRWrqlfCLlcBfBGDqrL", "gVNQjgdVhdfqqhlDCBDs", "NmjgbtmNtjNnjbPbvRJPbpwZwZSD", "tNHGccGNthtSGmVjjVmrrVPqSB", "fgDTwRwDFmLTFlspBBqjjBgqBssB", "mLCZwZRMJMbtdWMtvd", "TPzHPPgChjsgPdPTjQvZLvnpLQnvlRQn", "GScFSzFWWrfGGMrVFMqGqmrBnplmwmnlZZlmnvvvLRnJLLvJ", "qVSVFtFtFtSzrTNNDsHhhNTHht", "NQqtqmqmNhvvclvhcljJ", "CSCfMZSgWMvfWgrbjwcMJwrrrclr", "CGSCZgSGZPRTSCWWDgGBRtnFRvqNRsLLzmsLzqpq", "tWmtCZjnWZWCGjtnnmtcwFvvlgSDTDTvVwsVgCfT", "LpLhpLdqbBMNsQPBQhpLvgFqllgfllvVvwTDTwlw", "pNQBBdLbBPpPHLmGsRWjRZJzWZHc", "WtjBSvBjWzTtzvDTjBfbbthsMNRNgCMQDgRcCcQwLRgCQgNc", "HJmqnHqHpplVnlPdqGrpGQNLCgSwLMwFwFFCgnMLRw", "SdJGpHVZmqpVVVdZVJGddsjvzzvZTsZvWTbvszWjWj", "FhRhhLZgLZhCRWZBFFWRmGbvSgHqvvbPvHTPccVncb", "wzSMpjJdwssdrdDfJJJsJSvpGVPqGpvVqTVqTnccnTvH", "rwfMMdtDjNwjzDrjDDdtChRZWSWhmCWBSmLQRW", "RWLNLWrhtrhWJmLnSStBBdVtBGVVBt", "wQqnzjCFbflqpQlQFTDDGGsGDBZBSZMsDVfG", "QvqCTwjjTqwbTqjznFzQvqjFJgmvgghJgPmgmvPNmNRJJNgN", "qLqwhztjhqqDDzjZqqjPMmFmCnVDsmgbggggTMDC", "WBhWJQrJcRmnFnWMTTCF", "lvvJSlGSvBvJQBrcpSfwwLjLPjLfhptjwNtp", "sbFjnZpPPGZLZzCRhqbJhJMCqMgS", "vtNvFHBcNwNDHffvtfQMSMJVRMBMChVqSMCBJV", "cQlvTffDlFWTlcfFTlHQNtzzGGWGdLsGWdrnzspjGdGr", "LMQtlzlMQLLrztVfVdfqDdrhrhdd", "JPJTHcvPTPTJGPZgbmvGPmcZhwRVdDBdSWfdRHSBfqBSVHqq", "sJchPZGccmcbvcmgmPcCnnnnpzppQppspFjQntMl", "qtQQtsMDqtPDGQltPHbsLFnMccRNcVLLrVNVwMVM", "LCSdzZdBZmvzZTCBfJrwnWppFcWrFpdRnWpR", "ThSgBZTLJmPHlgQHjPtq", "mrwGPrVrbjbPVmwmbdTwbGfJMDJMgsqhhDjsqjJppfqt", "SQnLnWnWHLSFCRnlQRnFhqfsDMJMppqDfcWgpDfD", "NCSvLQnRSQFBLBzdgvTbbwPrzbPZ", "FFjvvHZbHZnZpvFHZcFbgQVwgwQnJfQPVNQJGqSq", "RWmCmdClRtTzVRwVfVQPNQgN", "shwhzTsmlbhZDLbBHL", "PpPHllshHDTlsprJrsPQpltzjVzjLNggZNznLNLnhNnnjL", "qRBvSwqBdRqvmfvCRSSLjcnVcVmLgmnNZjmQVg", "vdfbSfBWffMbQqQdtprtslHJsWDGHptt", "pqQdFWlQZpGZpLpS", "wnjwJhjvVgjwvwvsgwgtsRTtssGTtLrNtrSrHS", "VDJVMGCCChjccDJDwgwVJvMBzBfzbzbDPPFBFBbffzbQqq", "gBwwBZGhcfhnFjvrQjMhrjQQ", "PPLJNdNldlNSRmzLSlpbHQvbvdMtjjbMtMtt", "lqDJmlSmlmPzqNmzmVnvnBZDgvBWgcZTfD", "HMqrwWqzWJqHzrjgGFNNtQFMFQnFBt", "LddPLdVmchPSvmcvTZlvghLLFBDNDtFGDQpRnntnFDQnFPnB", "SbSvZTSLSgqbCHJWzr", "TGcjzjgtNqjttgNNTTjmGwLhfQQfDnDLDwSQWTSCvh", "PHJRJJbBVMPRMJHbJRMPbwCQSSvfCDhVhvvwwvQLnW", "ZJPMbHbJJJsdsJplRRRZsPJztrFrqtzGrgmcrprcmFjDgN", "tlDpSbpwgbgtpddJppgJwJDtNQWGQlcGQGhlhnGGWcrcWWFr", "MTZLqzjfFLqLjRfvqsQhNPGnhGGsnchW", "LMCzjzMTTjjFRfZMBTCvRfLRDDbVVpSbSgwwwtSBSSDJgStg", "ZLVTrJmJDHFtzSTlpc", "wNhhNfhvwwvvfvPnsNPhglszqpcHcFbbFSzSzzCHzb", "NWjPwgNgRHGWvhwWPfgfGwjMDQJdQLVLJLQVVLRdBRJrZr", "CPRJCFJTqZfJlJRqssHJftCWQMnHHwMbbngMMrQMgMWwQn", "BmzVVhvvcvDdWgwVrTnrMb", "BjzvhjLLczzBjLchDLmLJtsCqFClTqsZCPtPTCjq", "DbWjNCWQCRRNsDPpFGcjjcqFqFfm", "PZdMSzSZTtZZqVmpqmmmTpgg", "ZvZMzBztzvhvddPMQlNCQDbQLBLrsRRW", "WzWFhHpWhvCpPpPLswMHswMMHLbgmH", "NNZSZTVQNrTnqDqrrwtwwLstsMGMnbntGm", "TBmQcrNqNSQVmrmQBPdpFFzhFlPzzCPF", "nBgmSrjgmjtmrbjSFGLWtLVpFVQQVGFL", "JlChvCzvqCqWffwFdFVQfPVPHPFGLV", "JzvTThZcCCMcMMwJzlbjTjmnRgRTTBnWgbBn", "rppjbbDpGnwrGprVCLLJZDzQqZzLNQqc", "htflFBFmBBlWTTgsggtZHMQLCCCcHqHMfZczHq", "gFdFTWgRhBmWWTFSGQbVnSSPnvndpv", "qFSRRGGgTgThTQhcllCWCJCctWWhfJ", "bvbdzNDMzHZNNHFHfJWWjljWNNfcnWtn", "PdbPdPBHmsdbdbPdBHBdmdmsgrTqsGQRTwSpSFrqrRSFpRwp", "pQJZZGQtChQtpWZQTTWhNtVdVWSLBrsLSVrLvrvrLdBd", "lMHnzGRgPRMSMBLcvBSS", "nglFzflzHRDGgzfzPgHRbTDQthbZbhhppNbbCqhb", "jVrvrJjpZfZCCGctwhbhMRcM", "BQQnFFTBdBndzssFsdTbRwDGTPGbcMbwtDgbcG", "HnLtQQBLtWNrVpqjJvWN", "dnVlsnJlMqnlNqJdnMRvDHBRvbBLHLpRSPPPRS", "NcGGCthFwcFwmjCTGDSfPSSHSPfPtDHfbD", "zNWNZGWNzQnWlJWVJn", "tMGSBtRtvjFcGpQrQQQQrp", "FffbJTJfPLNbTnJJmlVcQVfpQmlWVVfH", "FTdJJdhNvZhMtRSh", "pSTfMtMLSTPsPsBszP", "jdlmlFHHhVdmVHFNFRnHzHQJsGZBJbbJDvsDRPBsrGrDrJ", "VHnFjcdccjlmNVmnzmNVmCMggfqwtLLfSMwWtcWMSg"];

const duplicateCharChoices = [68, 87, 82, 86, 101, 120, 88, 108];
const leftCharChoices = [103, 85, 109, 111, 89, 99, 113, 90, 97, 116, 104, 106, 114, 107, 74, 100, 102, 78, 81, 83, 75, 77];
const rightCharChoices = [118, 98, 73, 112, 115, 79, 69, 70, 65, 76, 119, 84, 105, 72, 67, 117, 121, 71, 80, 110, 66, 122];

function getRawBackpackData(testRun) {
    if (testRun === 1) {
        return sampleCaseToRawData(sampleCases1);
    } else if (testRun === 2) {
        return sampleCaseToRawData(sampleCases2);
    }

    let numBackpacks = randomInt(10, 50) * 3;
    let data = [];
    for (let i = 0; i < numBackpacks; i++) {
        let backpack = [];

        let numItems = randomInt(5, 20);
        for (let itemIdx = 0; itemIdx < numItems; itemIdx++) {
            backpack.push(randomChoice(leftCharChoices));
        }
        for (let itemIdx = 0; itemIdx < numItems; itemIdx++) {
            backpack.push(randomChoice(rightCharChoices));
        }
        let insertIndexRight = randomInt(0, (backpack.length / 2) - 1) + (backpack.length / 2);
        let insertIndexLeft = randomInt(0, (backpack.length / 2) - 1);
        let insertItem = randomChoice(duplicateCharChoices);
        backpack.splice(insertIndexRight, 0, insertItem);
        backpack.splice(insertIndexLeft, 0, insertItem);

        data.push(backpack);
    }
    return data;
}

function sampleCaseToRawData(sampleData) {
    return sampleData.map(function (backpack) {
        let charCodes = [];
        for (let i = 0; i < backpack.length; i++) {
            charCodes.push(backpack.charCodeAt(i));
        }
        return charCodes;
    });
}

function rawDataToBackpackFile(rawData) {
    let result = [];
    for (let i = 0; i < rawData.length; i++) {
        let backpack = rawData[i];
        result.push(backpack.length);
        for (let i2 = 0; i2 < backpack.length; i2++) {
            result.push(backpack[i2]);
        }
    }
    return result;
}

function getExpectedResult(rawData) {
    // raw data is [[ascii, ascii], [ascii, ascii]];
    let sum = 0;
    for (let backpackID = 0; backpackID < rawData.length; backpackID++) {
        let priorities = convertToPriorities(rawData[backpackID]);
        let leftSet = getSymbolSet(priorities.slice(0, priorities.length / 2));
        let rightSet = getSymbolSet(priorities.slice(priorities.length / 2, priorities.length));
        sum += (findCommonSymbol(leftSet, rightSet) + 1);
    }
    return sum;
}

function convertToPriorities(backpack) {
    return backpack.map(function (item) {
        return item > 90 ? (item + 1 - 97) : (item + 27 - 65);
    });
}

function getSymbolSet(priorities) {
    let symbolSet = [];
    for (let i = 0; i < 52; i++) {
        symbolSet[i] = 0;
    }
    for (let i = 0; i < priorities.length; i++) {
        symbolSet[priorities[i] - 1] = 1;
    }
    return symbolSet;
}

function findCommonSymbol(leftSet, rightSet) {
    for (let i = 0; i < 52; i++) {
        if (leftSet[i] > 0 && rightSet[i] > 0) {
            return i;
        }
    }
    return -9999;
}
