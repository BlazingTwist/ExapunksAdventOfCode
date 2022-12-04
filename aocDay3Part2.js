// For the latest Axiom VirtualNetwork+ scripting documentation,
// please visit: http://www.zachtronics.com/virtualnetwork/
// noinspection DuplicatedCode

function getTitle() {
    return "Day 3.2 : Rucksack Reorganization";
}

function getSubtitle() {
    return "Advent of Code 2022";
}

function getDescription() {
    return ""
        + "Find the problem description here https://adventofcode.com/2022/day/3\n"
        + "New: report the priority-sum of the shared item among each group | all else remains the same:\n"
        + "The Quartermaster resides in Tent5 (Link 805), he stored all of the backpacks in File 200, prefixed by their size."
        + " Also, backpacks are stored as the ASCII codes of their characters. [A = 65, Z = 90] and [a = 97, z = 122].\n"
        + " For example: the backpacks ['ab', 'c'] are stored as [2, 97, 98, 1, 99].\n"
        + "You are guaranteed that the sum is in range [0, 9999], no preprocessing needed."
        ;
}

let currentTestRun = -1;
let rawBackpackData = null;
let backpackData = [];
let expectedResult = 0;
let error = null;

function initializeTestRun(testRun) {
    let recompute = currentTestRun !== testRun;
    currentTestRun = testRun;

    if (recompute) {
        error = null;
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

    if (error != null) {
        printConsole(error);
        printConsole("This means that the testRun might be unsolvable.")
        printConsole("Please report this to the Level-Creator.")
    }
}

function onCycleFinished() {
}

const sampleCases1 = ["vJrwpWtwJgWrhcsFMMfFFhFp", "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL", "PmmdzqPrVvPwwTWBwg", "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn", "ttgJtRGJQctTZtZT", "CrZsJsPPZsGzwwsLwLmpwMDw"];
const sampleCases2 = ["NGvdqJmJvpNbGRMGQgRsfgfn", "WlHTHShlLwSWjFRsncfbcwsgQc", "BHtSBHWHSCWLZHlhjTHLLdbNNqNpzpDzNvDvtPmmPp", "JJSShnTpDSJJlllfwBNVbMQWwhQhgQtt", "cTzrvrHdLwwzttQNWB", "qrFqTFvqZvrmsplsjlnDflnZ", "mhhhVHvNNddHMwBqQwlWZZtv", "fbjzjJllCtWjjrZtjq", "CbgcgpPRDJfzVHFFnSnsSDlm", "ZqBPqBQnPLmqZsFqhsvFsLZQMfSSMbbWddWbjbJSrgWgJf", "NRHnlllcDwwCNClNtttHbNJrSJNfbdWMdfbWgdrJ", "cHGlzTptHtCpncHnCpHpRGzDmvVhqLmvLPmPvLqPmzsqqmPB", "rCzVtMMbMvCmmvGlclFQFfLpJFJfJpcLHPJL", "nDGGwqGqnRTfpHLpRFpLFf", "ZNdNTDsWgNZsZBndnGrzrlMrjgrmjVGjvC", "MgFZHFTgqFFDZZDTdVdHrzQvLzCGwpCPrGLqQpzz", "JsnmbjhmffJbRNJppzPPzwzzrwdv", "lfblfthBRbBRjnjhBtBlZgdVcFSTVFDtSSWgMcdM", "hPVhVhWPCMhlDTTWdrPlTcLjfbZbFNjZBbFNBbdBFbsB", "MHSwMJpHnqJHwtqHGqGGmvqZsZFjBmsBNRBFfLbsFsZfsZ", "pqtMHHQpvqnwMpgJMCChTQhVVlclPWrCCD", "zRBBhZFwWZlBQpMZNNNJsfDpLsNsJppN", "SvggPbjvVSvvtgGVPbbnSMcCLtMrDddssJdsLdfdCD", "mTSmMgHjgmgGgqzTwZwBlBFzwB", "WLzWZHWSZPFRVSPSPM", "hmrvmGvfTCmhBGBqTfnmJFfdbQcwdMhMwRdbQMVQQcMhsQ", "JGJJnrnnCmqBTJTrNBqBLDzHFLFDNgjZlWtDNZHL", "bwbbnWwpbTwFHwRzzzmH", "ZccjZjddjPVhJmrBQHHFQRHcWF", "NVhWldsMjZZZLSnvSTGTgvMb", "ccJbHpzccZJsNpJCmHHlBTgHnlTPmF", "qvQGQfDVhhDfvVfVDSdDCbFnjmllPQjlbCmnFgjg", "hSbtWRGvhdfDVdVRfvRNpsWsZLNMZzcswLZWMM", "vlTdlBTMdtjcvLGmtb", "SSgfSsJngCSSwNFgspHFNFFpjlbGjQbbQGLthLnWtmWWhjbm", "SJsfqqgfNHwJfHgCpwzBZVMDBPMMRPTlqzBr", "VHsVhtbRHRpVHBfBCJdNfGjggGJdqLGq", "wSzSrrSMPDSDwzPjdqJjNwGdsLqGjj", "MnrnQTnWZWWzWQDMvZhtHtshhHlHBcBBsvVt", "DZbPqdTqGTZtRrzjFmZZtF", "gjQwVvBVWgfghvgmcrBNFccHFRmHtF", "QlgvWlfgVsQfdlqqjqPDbPlM", "VcfLwwcMlpnfVDrDtrtvbjMtTM", "mmgBgzSQmQdgHBFSLvvbDTJmTDvTJJDr", "RWNBHHzWNSdSdzFgSLNWWfZGwfpcwWVnnfpCCWlV", "GDZLtsJMFGLDPnbblJlNJNcJ", "BBRgSwqwqRZhTVSqjVgRwCdQcmcPmdnPPnPnmjlrbmQj", "RCqfVvhfCCShBCRfVCwztDGZMHpLWHftFptspF", "dlZqlBfBSShZhvprbCJTDrJCJjJNDh", "WGRwQwHsMVVGMsVGcRVtQWRVpNCjWNDbzbDNJnbnrCbprrNW", "HgHRRVGGwLgLBPvgSp", "QPlZSlZzVLLDwhDfBppf", "bghGGhmqrspDcfbsbs", "tTrdTgFddtnvmdgvtCTdGTTqFZjjQQPVZPSZSjlZhVVQjlRS", "BgBFHnwwSTNHqSPN", "GJmCbDdlbZGCLhsstNLsMZZZ", "JGJpCCDvmlVDVldGJBVfBBRwRjnVWWBRfN", "WTFWQgGQtTMqMCJJzDVDgCchhj", "mNPBmPlPHrWmwmNLHmShcnJjhrnzJzdcdzdjJJ", "SHssNRSmvPRmlsmLwwsmwLvpQptpQWMQbGFQFtfpFfZQ", "DgpNLVjgNjjmzGPVRmfrZrctdTcrzfwzdfMc", "bnbNqnbFNwMcMtMfwF", "svCQHHhShnbCvHChsvHlLDVhJJLRJGNpgPJPjLLD", "TmBzgTVVBgfbmTVfPmFRJcHctnHDLDDLJqqBGB", "hwvlNCCvSphMwSvrlwCCrrDcfRlJDLRtGqcqHnqRqLGR", "pMSSMMNCSwMjjWhwrrjShQNFmsPmPFWbbZzVfZsPPPZVmZ", "sTTrWGCMggpVWhSBltWp", "HNJdwLDzNcJnNLwJJPqpllqhBpqStjfwlfpj", "PJHzDzFLtLccdLggvrGGmgvFssgG", "FwCssBFRBlvbBVdQ", "jPzjDpqNGqJzZGSNHppPclFvvdfVflblbJlmFfll", "SDzDpSNqjZjjZFSrHrFZTTCMLsnTLnnnMhrLtLnn", "ScWQvvSDddGrWVrG", "fwhPFLpwTfTjrzwHdmmmGdgdsPsqdRmV", "CHlFpTpwwCjwFjwjCBnrvQBZZcBSnZtvZl", "vJvdWVNslWtJcDtDHrDf", "GCnnMZpZnSZpvDqFtftfjfZqrh", "TbGMSRCRvWbPNsWB", "NNNdsRddGNdZZTCBtqbtBgtC", "zhFHppHhzcgmzQhccjgmjhQTnvvBFtBnCBbbnTvtCCtntt", "HpjmhfSjQwfzwHmcggfzjSLfVWPDsWMsMdWdDSMsGWPPllVN", "WSvcSSwrGzFsznqPNNWqPqlllB", "djVDdHdSPRqlntjN", "LpZZgpLgLHTDHVpDSTsffvGwrcfffGwv", "wGlbWGVvGlWlrvppbFMjQjsBjCsjmCzzQzNv", "ZgfdJcfZhMNCgSBRCQRz", "hcLDZPZdqZhJPhcTHJfPHVqlqtFWMrGGrpwVGVpWrV", "dsngCgdssHDVsHdsFDvMDvmMmjTjDFTL", "qZpSqptZZGWLTLSjlLHFzl", "NZqqRpWqhQpNhqhpZRWBJQQssJbbCsdbHsCbgb", "QdGBjjbHsBsBbBdGcwwTGrCRRrFcPPTC", "ZDtvWfMDvWScSrpzPccCdr", "hhZMgffDhZNvtDgHQsQQVQmBVVHNdV", "LhQLrzVdVmqcjmTNzm", "tHMZDJDZCDDtZMWwCJjcffqqfjRmqSRqcq", "CpHpZZWWtWpWwBplZWmQbhVBVPhnPrhbLQPvvs", "FFgFSmJmSgGpZzsmgGmbDlDzMQPDNPzRQRDjQQzV", "CLwnwWBdrtthttTWBWdPnVvRVVVNMSVQPvVnnV", "BTtdLthfhTrLdftCwqrddmGFcSfpGbsmFGHpmGFHHc", "JFJnMZwQBqnJJBqZJqPqMFBlbmBHblWbrmlfbWgbvmWrgW", "spCTjtVzsNDdsNdTsjVTtNzgHfmWWgHSSrgrbSbbhHbVHS", "TfCdjjsjzLNsfTszcdqcQMnRMPPRnFRPQRFP", "VvDgDqTDtTNWTWfNFWlW", "pzPvdssRNQFQRNZF", "CCpBpsrrccGvttgGqBDG", "jmZrrjlCJqmCVFMPbFbBZPVp", "dfLLfRMGTdHbssPLLPbFwL", "QWWHHTRQdRRHRMhzWQfvddngqJqjjNgqqjlgvrtjJmtn", "sGGwJdHDDTfWbTcRzbbz", "BmjvdhNVlFBZmSZvFrWpfpcBrbzbWcbqpf", "SLmSZLhNhMhwtLswPHGssd", "mGhlPclTmhhlJRWlRTDPlJtTFMngBcLSBHHBHLHSwncFgLwB", "jQVbjprjVfzbZQrzdGnHrrBLgSGwGFLHHg", "zzZqjQjdvsRlGqThGJ", "GSPQPvVmSwpVQGVlSQmWJRcFBpnFBcBWcJcJDc", "rTTCLmhTTbZNqMNbhjfhmDzsFDWzsDnfcBWDDDzcFs", "qmjhrhCtbMCZNhZMhNTZbLjvQdHdHGgwgdtQHlllQwlQgv", "ggpCCgvjPTJWjBjWWJgCWCdVVHRZdLfZhqLdZRHZrf", "GsstmNslzzzGlMnGMnVZRZrLpZqdhZHZrZHM", "lNbDsbltmzpsmmmnnccBJTwPgWvvvTwPwFPS", "FWbTRTdWGCnThqQVBQqJ", "rrDMPrDcSrvtcJdLVhVHQMQVBQ", "rNtNwrZtDNPmZStwvcvRlGFRlzCRlpmdpplbpb", "gHrHrlFgjCrNDfCMTzwwLN", "WhvTvvWnmQvpGWNNLzwWfNzW", "vTnRZhnRRBhscBVpcBTvnsjFltPqggqHPHHjHrPcgrFg", "VzfWRVsnNzWfsvpQPvvFbdVQpQ", "SqCqqhLDTTCTTCDcSdbpPvdPFFvhMbdMvF", "BCLBDCDGLlTClCSrglrGzWmrszzmHRJmfJfJpHNz", "dwGBHGdwdcCMCBzzZJJssZFsBBgt", "NRqbRbQhLQRLrQlTggFWlZtRlTvW", "FbNDFDLqnmLmNbqbLQbhLNDpPcVHMSVMwCVHcPnVGccwjdcM", "LdHtrrrHrLZrBVbQjtPnnsVb", "TwfhhcTCTCpfJJwpTJwhDDPnbGsbFjlQnnQjFBFslsBQDl", "pwJCThfRCMMMvhchhwHSmWLZHLNHMdrdZzPg", "LbMQbHbHQLLMsWLvszvzvqCfqCCqss", "ScWlpmplWrDzlzvznJ", "RNNcZWhSZmdVdPwHbQQTTwNwjP", "jFFFtHZjwmLNmnQCFL", "sVbdsqcqHBHqrQrLPmWqQnmr", "sfGJVVzJJsczczfsczBzzvdbTMTptlTZZgDSDtGlplZSlgHt", "MgMQJdqqMDQJDggzTMgVplvffmctcCzmfjRlmmmjjR", "HrGbGswnBBtRvccBlljB", "HZPHRRGGshZHnnnwPnshnVZqMJJDdpQDVgDdVDWDpQ", "whwQRQGHRVhWRRcLLJgLmL", "jSnnzgBnpCZdCBjNmnNNJmllJTlccT", "jPSzrzpzpCjgfZZrZCFpdwQDQVVPttGDtVqQVtHqth", "mvnGFmvGhTcSCBcBpv", "bwMRzbQLwBQRWSctCcTtLpss", "JJgHZqRrbqDnmBjhDh", "MVvvGrsbGtVsgTggHjSFHJBBBg", "PPNpCpQPZppplttDNwZPBdfTFPPTSBWSFjjSTH", "CpNwChQCzDDNZwhZlpwZpqrqsGGsmmctGbbbzcmMms", "pjMbgCgdQjCgBjQQCncwcGGLDZvFtGLsZZFZtH", "zPhhrVhVVSmqVqhmzPqvDtsLLHrFWFvGFGFsvt", "SVPzVTzJNBfjDQbQTb", "CRDjjRmmLhjRFFChmHDNLZzsZNnPZNzlnnsvlv", "SSqcMwdrctQVtqTwSSgnvZnsZvnBZpcPsvlvbz", "trMGSSVdQQqdGMtwwQCmRHHhmJFhsfJGfjHh", "phJzrnJJwNNSJhSnwpwGGZzmvNfmmDvfcvcDfvbRPNcvvR", "tWtgQBqsqdLFLmZvTRTfDZcb", "ttssdgQqsHQtZFsqVdgdgdCBJGSphnljnJhjwrhnpJrrzJHl", "srzpVWrWTptbrPpPPtcWpNhNNNdfhhDgDNvfBDNNds", "jmnQHmLqlnSlGMjqnLLljRHqdNdgwHZBgfhZvBdNhDwBhhtZ", "MjSlnLmMLnCGjlSQLVWCzbrcTpPtpFbFWr", "ZnQRczHZsMSRZQcBRSZRscQwJbWFbbQwpWTjdFLJTJTWwd", "PVmGqDlGhDPVNvqDmmqtqLbbpJfFJwpbdJpdbfdjwdbl", "VGNCgGPgqVqhNvmNCNZnSsRLRsMzzgBRnHrS", "ZgMMgJMhjmZrZgggmlTTbfwTfRfbRGwlGTDf", "nPqQttNVPzSPnqpGDwDDbGfwbJ", "dJvQzzJtdSPWSthhHMjgMvrHghsv", "cMvwHCWcMnwWnScWVFzTqHpHFpVBFtFp", "bbblgRDhtlGgRPFBRqFpmzVFBTFp", "fPbtGJGhfDfDsPhQJDPbbnjjSWnwjdvQCnSSCnCSCM", "NcgDtwghTLntgNtLrjfHSSFlSbCfprlL", "ZGGMmdmVZVvsRQvMGRVVZCHPfpZSfZbFPlbPjCfH", "RVRjvRzMQQJBVmzzgWgzTWTWhNcWzN", "gsgBqdsWprWddpBghBpwwJzbLcvhCZmwZCFcJC", "PRPtStHfwmJvzPmF", "HnSHHRQDVFsVVgsgTWsG", "QRQTRrDHSLSNzzZLzZ", "dBmPwfwffWtWRtzdhhLzLzLzzLFN", "BtWnWCCVBWtCBmRPqVmqmntjjlJHJslJQVsQjsbbHrjHDQ", "TwwJrHSMnHGvWHMvvSqrrZbRrRqfqVNfbNRc", "GjhstmPFFhlFtmmjQtlgVcZVfcgqqNRNpgRcbP", "CzdCdFCtdzGWGJwWWHdW", "zfSVfSpHVpCHSZLnsttDnvDvpcsqRc", "rWzMGWFFPBFjqjDjFDFs", "PbQQWbJPrQwPrrPBwrJCVzZZLZdLSLLmfZfHJd", "gPDPLgsLNslNLHqlLqqjhjnwwjJbDjnjwTRnGD", "tzdMdMddmcRMdtcFFGWnwWjFwjFhGbTG", "mRMmttpVHNCNpNZN", "mfCFGfDDFCDWtvvstjjJ", "njnVnrggLlwVVqLpvHVpMpMsHVhhMW", "QQPPPnjlPPSgwBrnNLcdFCNNGFbmbZFcZzFf", "NzNHFNFnFrtgwwPchvGFFS", "LsjdQCVsTsLCTTdMCJtQgPPqwhPgqScPGvSZ", "jdLdVjJtCVjRCMpmpNfNNWHrNzDrNrHrmr", "NmggPPrPbPmdCbcfCNLVRRWpWTWRVTpdVVWspW", "qGhDzGqnwGQnJrjllJWttMRDFRtMVsTDTTZs", "SrnHhGQlvLmSfbfc", "DmdPCJMLlQdSjGCqjcGGccHH", "zWtBwfsgvVnBfftWtnnpTmnTRhppHpTqpc", "wzFtwZWmsVFzZtvPJSPbMFJFDJJJJd", "wrPRRSJSWrTSRzRWrqlfCLlcBfBGDqrL", "gVNQjgdVhdfqqhlDCBDs", "NmjgbtmNtjNnjbPbvRJPbpwZwZSD", "tNHGccGNthtSGmVjjVmrrVPqSB", "fgDTwRwDFmLTFlspBBqjjBgqBssB", "mLCZwZRMJMbtdWMtvd", "TPzHPPgChjsgPdPTjQvZLvnpLQnvlRQn", "GScFSzFWWrfGGMrVFMqGqmrBnplmwmnlZZlmnvvvLRnJLLvJ", "qVSVFtFtFtSzrTNNDsHhhNTHht", "NQqtqmqmNhvvclvhcljJ", "CSCfMZSgWMvfWgrbjwcMJwrrrclr", "CGSCZgSGZPRTSCWWDgGBRtnFRvqNRsLLzmsLzqpq", "tWmtCZjnWZWCGjtnnmtcwFvvlgSDTDTvVwsVgCfT", "LpLhpLdqbBMNsQPBQhpLvgFqllgfllvVvwTDTwlw", "pNQBBdLbBPpPHLmGsRWjRZJzWZHc", "WtjBSvBjWzTtzvDTjBfbbthsMNRNgCMQDgRcCcQwLRgCQgNc", "HJmqnHqHpplVnlPdqGrpGQNLCgSwLMwFwFFCgnMLRw", "SdJGpHVZmqpVVVdZVJGddsjvzzvZTsZvWTbvszWjWj", "FhRhhLZgLZhCRWZBFFWRmGbvSgHqvvbPvHTPccVncb", "wzSMpjJdwssdrdDfJJJsJSvpGVPqGpvVqTVqTnccnTvH", "rwfMMdtDjNwjzDrjDDdtChRZWSWhmCWBSmLQRW", "RWLNLWrhtrhWJmLnSStBBdVtBGVVBt", "wQqnzjCFbflqpQlQFTDDGGsGDBZBSZMsDVfG", "QvqCTwjjTqwbTqjznFzQvqjFJgmvgghJgPmgmvPNmNRJJNgN", "qLqwhztjhqqDDzjZqqjPMmFmCnVDsmgbggggTMDC", "WBhWJQrJcRmnFnWMTTCF", "lvvJSlGSvBvJQBrcpSfwwLjLPjLfhptjwNtp", "sbFjnZpPPGZLZzCRhqbJhJMCqMgS", "vtNvFHBcNwNDHffvtfQMSMJVRMBMChVqSMCBJV", "cQlvTffDlFWTlcfFTlHQNtzzGGWGdLsGWdrnzspjGdGr", "LMQtlzlMQLLrztVfVdfqDdrhrhdd", "JPJTHcvPTPTJGPZgbmvGPmcZhwRVdDBdSWfdRHSBfqBSVHqq", "sJchPZGccmcbvcmgmPcCnnnnpzppQppspFjQntMl", "qtQQtsMDqtPDGQltPHbsLFnMccRNcVLLrVNVwMVM", "LCSdzZdBZmvzZTCBfJrwnWppFcWrFpdRnWpR", "ThSgBZTLJmPHlgQHjPtq", "mrwGPrVrbjbPVmwmbdTwbGfJMDJMgsqhhDjsqjJppfqt", "SQnLnWnWHLSFCRnlQRnFhqfsDMJMppqDfcWgpDfD", "NCSvLQnRSQFBLBzdgvTbbwPrzbPZ", "FFjvvHZbHZnZpvFHZcFbgQVwgwQnJfQPVNQJGqSq", "RWmCmdClRtTzVRwVfVQPNQgN", "shwhzTsmlbhZDLbBHL", "PpPHllshHDTlsprJrsPQpltzjVzjLNggZNznLNLnhNnnjL", "qRBvSwqBdRqvmfvCRSSLjcnVcVmLgmnNZjmQVg", "vdfbSfBWffMbQqQdtprtslHJsWDGHptt", "pqQdFWlQZpGZpLpS", "wnjwJhjvVgjwvwvsgwgtsRTtssGTtLrNtrSrHS", "VDJVMGCCChjccDJDwgwVJvMBzBfzbzbDPPFBFBbffzbQqq", "gBwwBZGhcfhnFjvrQjMhrjQQ", "PPLJNdNldlNSRmzLSlpbHQvbvdMtjjbMtMtt", "lqDJmlSmlmPzqNmzmVnvnBZDgvBWgcZTfD", "HMqrwWqzWJqHzrjgGFNNtQFMFQnFBt", "LddPLdVmchPSvmcvTZlvghLLFBDNDtFGDQpRnntnFDQnFPnB", "SbSvZTSLSgqbCHJWzr", "TGcjzjgtNqjttgNNTTjmGwLhfQQfDnDLDwSQWTSCvh", "PHJRJJbBVMPRMJHbJRMPbwCQSSvfCDhVhvvwwvQLnW", "ZJPMbHbJJJsdsJplRRRZsPJztrFrqtzGrgmcrprcmFjDgN", "tlDpSbpwgbgtpddJppgJwJDtNQWGQlcGQGhlhnGGWcrcWWFr", "MTZLqzjfFLqLjRfvqsQhNPGnhGGsnchW", "LMCzjzMTTjjFRfZMBTCvRfLRDDbVVpSbSgwwwtSBSSDJgStg", "ZLVTrJmJDHFtzSTlpc", "wNhhNfhvwwvvfvPnsNPhglszqpcHcFbbFSzSzzCHzb", "NWjPwgNgRHGWvhwWPfgfGwjMDQJdQLVLJLQVVLRdBRJrZr", "CPRJCFJTqZfJlJRqssHJftCWQMnHHwMbbngMMrQMgMWwQn", "BmzVVhvvcvDdWgwVrTnrMb", "BjzvhjLLczzBjLchDLmLJtsCqFClTqsZCPtPTCjq", "DbWjNCWQCRRNsDPpFGcjjcqFqFfm", "PZdMSzSZTtZZqVmpqmmmTpgg", "ZvZMzBztzvhvddPMQlNCQDbQLBLrsRRW", "WzWFhHpWhvCpPpPLswMHswMMHLbgmH", "NNZSZTVQNrTnqDqrrwtwwLstsMGMnbntGm", "TBmQcrNqNSQVmrmQBPdpFFzhFlPzzCPF", "nBgmSrjgmjtmrbjSFGLWtLVpFVQQVGFL", "JlChvCzvqCqWffwFdFVQfPVPHPFGLV", "JzvTThZcCCMcMMwJzlbjTjmnRgRTTBnWgbBn", "rppjbbDpGnwrGprVCLLJZDzQqZzLNQqc", "htflFBFmBBlWTTgsggtZHMQLCCCcHqHMfZczHq", "gFdFTWgRhBmWWTFSGQbVnSSPnvndpv", "qFSRRGGgTgThTQhcllCWCJCctWWhfJ", "bvbdzNDMzHZNNHFHfJWWjljWNNfcnWtn", "PdbPdPBHmsdbdbPdBHBdmdmsgrTqsGQRTwSpSFrqrRSFpRwp", "pQJZZGQtChQtpWZQTTWhNtVdVWSLBrsLSVrLvrvrLdBd", "lMHnzGRgPRMSMBLcvBSS", "nglFzflzHRDGgzfzPgHRbTDQthbZbhhppNbbCqhb", "jVrvrJjpZfZCCGctwhbhMRcM", "BQQnFFTBdBndzssFsdTbRwDGTPGbcMbwtDgbcG", "HnLtQQBLtWNrVpqjJvWN", "dnVlsnJlMqnlNqJdnMRvDHBRvbBLHLpRSPPPRS", "NcGGCthFwcFwmjCTGDSfPSSHSPfPtDHfbD", "zNWNZGWNzQnWlJWVJn", "tMGSBtRtvjFcGpQrQQQQrp", "FffbJTJfPLNbTnJJmlVcQVfpQmlWVVfH", "FTdJJdhNvZhMtRSh", "pSTfMtMLSTPsPsBszP", "jdlmlFHHhVdmVHFNFRnHzHQJsGZBJbbJDvsDRPBsrGrDrJ", "VHnFjcdccjlmNVmnzmNVmCMggfqwtLLfSMwWtcWMSg"];

const duplicateCharChoices = [68, 87, 82, 86, 101, 120, 88, 108, 75, 77];
const leftChoiceSegments = [[103, 85, 109, 111, 89], [99, 113, 90, 97, 116], [104, 106, 114, 107, 74], [[100, 102], [78, 81], [83, 122]]];
const rightChoiceSegments = [[118, 98, 73, 112, 115], [79, 69, 70, 65, 76], [119, 84, 105, 72, 67], [[117, 121], [71, 80], [110, 66]]];

function getRawBackpackData(testRun) {
    if (testRun === 1) {
        return sampleCaseToRawData(sampleCases1);
    } else if (testRun === 2) {
        return sampleCaseToRawData(sampleCases2);
    }

    let numGroups = randomInt(10, 50);
    let data = [];

    let addSegmentPair = function (packA, packB, choicePool) {
        let item = randomChoice(choicePool);
        packA.push(item);
        packB.push(item);
    }

    let addUniqueSegment = function (packs, choicePerPack) {
        let len = Math.min(packs.length, choicePerPack.length);
        for (let i = 0; i < len; i++) {
            packs[i].push(randomChoice(choicePerPack[i]));
        }
    }

    let generateSegments = function (groupPacks, choiceSegments, segmentLength) {
        for (let itemID = 0; itemID < segmentLength; itemID++) {
            addSegmentPair(groupPacks[0], groupPacks[1], choiceSegments[0]);
            addSegmentPair(groupPacks[0], groupPacks[2], choiceSegments[1]);
            addSegmentPair(groupPacks[1], groupPacks[2], choiceSegments[2]);
            addUniqueSegment(groupPacks, choiceSegments[3]);
        }
    }

    for (let i = 0; i < numGroups; i++) {
        let groupPacks = [[], [], []];
        let segmentLength = randomInt(2, 6);
        generateSegments(groupPacks, leftChoiceSegments, segmentLength);
        generateSegments(groupPacks, rightChoiceSegments, segmentLength);

        // replace a random item with one shared across the group
        // this MUST be done before pushing a left/right shared item, since otherwise the replacement might break that constraint
        let sharedItem = randomChoice(duplicateCharChoices);
        for (let packID = 0; packID < 3; packID++) {
            let pack = groupPacks[packID];
            let replaceIndex = randomInt(0, pack.length - 1);
            pack[replaceIndex] = sharedItem;
        }

        // push an item that is shared across both sides of a pack
        for (let packID = 0; packID < 3; packID++) {
            let pack = groupPacks[packID];
            let packLenHalf = pack.length / 2;
            let insertItem = pack[randomInt(0, packLenHalf - 1)];
            let insertIndexRight = randomInt(0, packLenHalf - 1) + packLenHalf;
            let insertIndexLeft = randomInt(0, packLenHalf - 1);
            pack.splice(insertIndexRight, 0, insertItem);
            pack.splice(insertIndexLeft, 0, insertItem);
        }

        data.push(groupPacks[0], groupPacks[1], groupPacks[2]);
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

/**
 * @param {Array<Array<Number>>} rawData
 * @return {number}
 */
function getExpectedResult(rawData) {
    // raw data is [[ascii, ascii], [ascii, ascii]];
    let totalSum = 0;
    let numTriplets = rawData.length / 3;
    for (let tripletID = 0; tripletID < numTriplets; tripletID++) {
        let backpacks = rawData.slice(tripletID * 3, (tripletID + 1) * 3);
        let prioritySum = backpacks
            .map(function (pack) {
                return getSymbolSet(convertToPriorities(pack))
            })
            .reduce(reduceSymbolSets)
            .reduce(reduceSymbolSetToPriority);

        totalSum += prioritySum;
    }
    return totalSum;
}

/**
 * @param {Array<Number>} backpack
 * @return {Array<Number>}
 */
function convertToPriorities(backpack) {
    return backpack.map(function (item) {
        return item > 90 ? (item + 1 - 97) : (item + 27 - 65);
    });
}

/**
 * @param {Array<Number>} priorities
 * @return {Array<Number>}
 */
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

/**
 * @param {Array<Number>} setA
 * @param {Array<Number>} setB
 * @return {Array<Number>}
 */
function reduceSymbolSets(setA, setB) {
    let len = Math.min(setA.length, setB.length);
    for (let i = 0; i < len; i++) {
        setA[i] *= setB[i];
    }
    return setA;
}

/**
 * @param {Number} acc
 * @param {Number} isSymbolSet
 * @param {Number} index
 * @return {Number}
 */
function reduceSymbolSetToPriority(acc, isSymbolSet, index) {
    if (isSymbolSet) {
        if (acc > 0) {
            error = " acc was set, but symbol was also set!";
        }
        return acc + index + 1;
    } else {
        return acc;
    }
}
